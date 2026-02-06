import { useEffect, useState } from "react";
import { api } from "../api";

const formatDate = (iso) => new Date(iso).toLocaleDateString("en-IN");

export default function AttendancePanel() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState("");
  const [records, setRecords] = useState([]);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    api.get("/employees")
      .then((res) => setEmployees(res.data))
      .catch(() => alert("Failed to load employees"));
  }, []);

  const fetchAttendance = async (empId) => {
    try {
      const res = await api.get(`/employees/${empId}/attendance`);
      setRecords(res.data);
    } catch {
      alert("Failed to fetch attendance");
    }
  };

  const fetchFilteredAttendance = async () => {
    if (!selectedEmp) {
      alert("Please select an employee first!");
      return;
    }

    if (!fromDate || !toDate) {
      alert("Please select both From Date and To Date");
      return;
    }

    try {
      const res = await api.get(
        `/employees/${selectedEmp}/attendance/filter?from_date=${fromDate}&to_date=${toDate}`
      );
      setRecords(res.data);
    } catch (e) {
      alert(e.response?.data?.detail || "Failed to filter attendance");
    }
  };

  const markAttendance = async (status) => {
    if (!selectedEmp) {
      alert("Please select an employee first!");
      return;
    }

    try {
      await api.post(`/employees/${selectedEmp}/attendance`, { status });
      alert(`Attendance marked: ${status}`);
      fetchAttendance(selectedEmp);
    } catch (e) {
      const msg =
        e.response?.data?.detail ||
        e.response?.data?.message ||
        "Attendance marking failed";

      alert(msg);
    }
  };

  const handleSearch = () => {
    if (!selectedEmp) {
      alert("Select an employee to view records");
      return;
    }
    fetchAttendance(selectedEmp);
  };

  return (
    <div>
      {/* Employee select + actions */}
      <div className="row">
        <select value={selectedEmp} onChange={(e) => setSelectedEmp(e.target.value)}>
          <option value="">-- Select Employee --</option>
          {employees.map((e) => (
            <option key={e.employee_id} value={e.employee_id}>
              {e.full_name} ({e.employee_id})
            </option>
          ))}
        </select>

        <button onClick={handleSearch}>Search Records</button>
        <button onClick={() => markAttendance("Present")}>Mark Present</button>
        <button onClick={() => markAttendance("Absent")}>Mark Absent</button>
      </div>

      {/* Filter by date range */}
      <div className="row" style={{ marginTop: "12px" }}>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />

        <button onClick={fetchFilteredAttendance}>Filter</button>
      </div>

      <h3 style={{ marginTop: "18px" }}>Attendance Records</h3>

      {records.length === 0 ? (
        <p>No attendance records found.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {records.map((r) => (
              <tr key={r.date}>
                <td>{formatDate(r.date)}</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
