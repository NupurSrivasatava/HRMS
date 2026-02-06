import boto3
from dotenv import load_dotenv
import os
load_dotenv()

YOUR_AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
YOUR_AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")

dynamodb = boto3.resource(
    "dynamodb",
    aws_access_key_id=YOUR_AWS_ACCESS_KEY_ID,
    aws_secret_access_key=YOUR_AWS_SECRET_ACCESS_KEY,
    region_name="us-east-1",
)

employee_table = dynamodb.Table("Employees_Table")
attendance_table = dynamodb.Table("Attendance_Table")

