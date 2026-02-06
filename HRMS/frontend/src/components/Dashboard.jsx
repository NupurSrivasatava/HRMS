import { useEffect, useState } from "react";
import EmployeeForm from "./EmployeeForm";
import EmployeeTable from "./EmployeeTable";
import AttendancePanel from "./AttendancePanel";
import { api } from "../api";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/dashboard/summary")
      .then((res) => setSummary(res.data))
      .catch(() => setError("Failed to load dashboard summary"));
  }, []);

  return (
    <div className="dashboard-grid">

      {/* HEADER */}
      <div className="card full-width">
        <h1>HRMS Dashboard</h1>
        <p>Manage employees and attendance</p>
      </div>

      {/* SUMMARY */}
      <div className="card full-width">
        <h2>Dashboard Summary</h2>

        {error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : !summary ? (
          <p>Loading...</p>
        ) : (
          <div className="summary-row">
            <p><b>Total Employees:</b> {summary.total_employees}</p>
            <p><b>Total Attendance Records:</b> {summary.total_attendance_records}</p>
            <p><b>Present Today:</b> {summary.present_today}</p>
          </div>
        )}
      </div>

      {/* TWO COLUMN SECTION */}
      <div className="card">
        <h2>Add Employee</h2>
        <EmployeeForm />
      </div>

      <div className="card">
        <h2>Attendance Management</h2>
        <AttendancePanel />
      </div>

      {/* FULL WIDTH EMPLOYEE TABLE */}
      <div className="card full-width">
        <h2>Employee List</h2>
        <EmployeeTable />
      </div>

    </div>
  );
}
