import { useState } from "react";
import { api } from "../api";

export default function EmployeeForm() {
  const [form, setForm] = useState({
    employee_id: "",
    full_name: "",
    email: "",
    department: "",
  });

  const submit = async () => {
    if (
      !form.employee_id.trim() ||
      !form.full_name.trim() ||
      !form.email.trim() ||
      !form.department.trim()
    ) {
      alert("All fields are required!");
      return;
    }

    try {
      await api.post("/employees", form);
      alert("Employee added successfully!");
      window.location.reload();
    } catch (e) {
      alert(e.response?.data?.detail || "Failed to add employee");
    }
  };

  return (
    <div>
      <input
        placeholder="Employee ID"
        value={form.employee_id}
        onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
      />

      <input
        placeholder="Full Name"
        value={form.full_name}
        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
      />

      <input
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        placeholder="Department"
        value={form.department}
        onChange={(e) => setForm({ ...form, department: e.target.value })}
      />

      <button onClick={submit}>Add Employee</button>
    </div>
  );
}
