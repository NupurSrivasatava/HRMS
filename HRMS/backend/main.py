from fastapi import FastAPI, HTTPException
from boto3.dynamodb.conditions import Key
from database.employee_databse import employee_table, attendance_table
from model.employee_model import EmployeeCreate, AttendanceCreate
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
import pytz
from fastapi import HTTPException
app = FastAPI(title="HRMS Lite API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
        "https://hrmsnupur.netlify.app/"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/employees")
def add_employee(emp: EmployeeCreate):
    # Check duplicate employee_id
    existing = employee_table.get_item(
        Key={"employee_id": emp.employee_id}
    )
    if "Item" in existing:
        raise HTTPException(400, "Employee already exists")

    employee_table.put_item(Item=emp.dict())
    return {"message": "Employee added successfully"}

@app.get("/employees")
def get_all_employees():
    res = employee_table.scan()
    return res.get("Items", [])





@app.delete("/employees/{employee_id}")
def delete_employee(employee_id: str):

    # Check employee exists
    emp = employee_table.get_item(Key={"employee_id": employee_id})
    if "Item" not in emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    # Delete employee
    employee_table.delete_item(Key={"employee_id": employee_id})

    # Fetch attendance records
    response = attendance_table.query(
        KeyConditionExpression=Key("employee_id").eq(employee_id)
    )
    items = response.get("Items", [])

    # Delete all attendance records using batch_writer
    with attendance_table.batch_writer() as batch:
        for item in items:
            batch.delete_item(
                Key={
                    "employee_id": employee_id,
                    "date": item["date"]
                }
            )

    return {"message": "Employee and attendance deleted successfully"}


@app.get("/dashboard/summary")
def dashboard_summary():
    employees = employee_table.scan().get("Items", [])
    attendance = attendance_table.scan().get("Items", [])

    ist = pytz.timezone("Asia/Kolkata")
    today = datetime.now(ist).date().isoformat()

    present_today = sum(
        1 for a in attendance
        if a.get("date") == today and a.get("status") == "Present"
    )

    return {
        "total_employees": len(employees),
        "total_attendance_records": len(attendance),
        "present_today": present_today
    }


@app.post("/employees/{employee_id}/attendance")
def mark_attendance(employee_id: str, att: AttendanceCreate):
    # Verify employee exists
    emp = employee_table.get_item(Key={"employee_id": employee_id})
    if "Item" not in emp:
        raise HTTPException(404, "Employee not found")

    ist = pytz.timezone("Asia/Kolkata")
    today_ist = datetime.now(ist).date().isoformat()

    attendance_table.put_item(
        Item={
            "employee_id": employee_id,
            "date": today_ist,
            "status": att.status
        }
    )
    return {"message": "Attendance marked"}


@app.get("/employees/{employee_id}/attendance")
def get_attendance(employee_id: str):
    res = attendance_table.query(
        KeyConditionExpression=Key("employee_id").eq(employee_id)
    )
    return res.get("Items", [])


@app.get("/employees/{employee_id}/attendance/summary")
def attendance_summary(employee_id: str):
    res = attendance_table.query(
        KeyConditionExpression=Key("employee_id").eq(employee_id)
    )

    records = res.get("Items", [])
    present_days = sum(1 for r in records if r["status"] == "Present")

    return {
        "employee_id": employee_id,
        "total_days": len(records),
        "present_days": present_days,
        "absent_days": len(records) - present_days
    }




@app.get("/employees/{employee_id}/attendance/filter")
def filter_attendance(employee_id: str, from_date: str, to_date: str):
    response = attendance_table.query(
        KeyConditionExpression=
        Key("employee_id").eq(employee_id) &
        Key("date").between(from_date, to_date)
    )
    return response.get("Items", [])
