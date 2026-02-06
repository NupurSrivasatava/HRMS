import { useEffect, useState } from "react";
import { api } from "../api";

export default function EmployeeTable() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/employees")
      .then((res) => setEmployees(res.data))
      .catch(() => alert("Failed to load employees"));
  }, []);

  const deleteEmployee = async (id) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
      await api.delete(`/employees/${id}`);
      setEmployees(employees.filter((e) => e.employee_id !== id));
      alert("Employee deleted");
    } catch {
      alert("Delete failed");
    }
  };

  const filteredEmployees = employees.filter((e) =>
    e.full_name.toLowerCase().includes(search.toLowerCase()) ||
    e.employee_id.toLowerCase().includes(search.toLowerCase()) ||
    e.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <input
        placeholder="Search by name / ID / department..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredEmployees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredEmployees.map((e) => (
              <tr key={e.employee_id}>
                <td>{e.employee_id}</td>
                <td>{e.full_name}</td>
                <td>{e.email}</td>
                <td>{e.department}</td>
                <td>
                  <button className="danger" onClick={() => deleteEmployee(e.employee_id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
