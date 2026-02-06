import { useEffect, useState } from "react";
import { api } from "../api";
import Attendance from "./Attendance";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data);
    } catch (err) {
      alert("Error fetching employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const remove = async (employee_id) => {
    try {
      await api.delete(`/employees/${employee_id}`);
      setEmployees(employees.filter((e) => e.employee_id !== employee_id));
      alert("Employee deleted");
    } catch (e) {
  alert("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="card">
        <h2>Employees</h2>
        <p>Loading employees...</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Employees</h2>

      {employees.length === 0 && (
        <div className="card">
          <p>No employees found.</p>
        </div>
      )}

      {employees.map((e) => (
        <div key={e.employee_id} className="card">
          <h3>{e.full_name}</h3>
          <p><b>ID:</b> {e.employee_id}</p>
          <p><b>Email:</b> {e.email}</p>
          <p><b>Department:</b> {e.department}</p>

          <button onClick={() => remove(e.employee_id)}>Delete Employee</button>

          <Attendance employeeId={e.employee_id} />
        </div>
      ))}
    </div>
  );
}
