
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getAttendance,
  getAttendanceStats,
  addAttendance,
  updateAttendance,
  deleteAttendance,
} from "../services/attendanceService";

const getToday = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const makeEmptyForm = () => ({
  studentId: "",
  studentName: "",
  department: "",
  attendanceDate: getToday(),
  status: "Present",
});

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "10px 12px",
  border: "1px solid #cbd5e1",
  borderRadius: "8px",
  background: "#ffffff",
  color: "#172033",
  fontSize: "14px",
};

const panelStyle = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "22px",
  marginBottom: "22px",
};

const tableStyle = {
  width: "100%",
  minWidth: "760px",
  borderCollapse: "collapse",
};

const headerCellStyle = {
  textAlign: "left",
  padding: "12px",
  background: "#f8fafc",
  color: "#64748b",
  borderBottom: "1px solid #e2e8f0",
  fontSize: "12px",
};

const cellStyle = {
  padding: "13px 12px",
  borderBottom: "1px solid #edf2f7",
  fontSize: "14px",
};

const primaryButtonStyle = {
  padding: "10px 15px",
  border: "none",
  borderRadius: "8px",
  background: "#4f46e5",
  color: "#ffffff",
  fontWeight: "600",
  cursor: "pointer",
};

const secondaryButtonStyle = {
  padding: "7px 10px",
  border: "1px solid #cbd5e1",
  borderRadius: "7px",
  background: "#ffffff",
  color: "#334155",
  cursor: "pointer",
};

function extractRecords(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.records)) return data.records;
  if (Array.isArray(data?.attendance)) return data.attendance;
  if (Array.isArray(data?.content)) return data.content;
  return [];
}

function getStat(stats, keys, fallback) {
  for (const key of keys) {
    const value = stats?.[key];

    if (value !== undefined && value !== null && value !== "") {
      const number = Number(value);
      if (Number.isFinite(number)) return number;
    }
  }

  return fallback;
}

function getStatusStyle(status) {
  const value = String(status || "").toLowerCase();

  if (value === "present") {
    return { background: "#dcfce7", color: "#166534" };
  }

  if (value === "absent") {
    return { background: "#fee2e2", color: "#991b1b" };
  }

  if (value === "late") {
    return { background: "#fef3c7", color: "#92400e" };
  }

  return { background: "#e2e8f0", color: "#334155" };
}

function StatCard({ label, value, color }) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "20px",
      }}
    >
      <div style={{ color: "#64748b", fontSize: "13px" }}>{label}</div>
      <div
        style={{
          fontSize: "28px",
          fontWeight: "700",
          color,
          marginTop: "10px",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({});
  const [form, setForm] = useState(makeEmptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const loadAttendance = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const results = await Promise.all([
        getAttendance(selectedDate),
        getAttendanceStats(selectedDate),
      ]);

      setRecords(extractRecords(results[0]));
      setStats(
        results[1] && typeof results[1] === "object" ? results[1] : {}
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to load attendance. Check your backend and login session."
      );
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    loadAttendance();
  }, [loadAttendance]);

  const totals = useMemo(() => {
    const presentFallback = records.filter(
      (item) => String(item.status).toLowerCase() === "present"
    ).length;

    const absentFallback = records.filter(
      (item) => String(item.status).toLowerCase() === "absent"
    ).length;

    const lateFallback = records.filter(
      (item) => String(item.status).toLowerCase() === "late"
    ).length;

    const present = getStat(
      stats,
      ["present", "presentCount", "totalPresent"],
      presentFallback
    );

    const absent = getStat(
      stats,
      ["absent", "absentCount", "totalAbsent"],
      absentFallback
    );

    const late = getStat(
      stats,
      ["late", "lateCount", "totalLate"],
      lateFallback
    );

    const total = getStat(
      stats,
      ["totalRecords", "totalAttendance", "totalStudents", "total"],
      records.length
    );

    const percentage = getStat(
      stats,
      ["attendancePercentage", "percentage", "attendanceRate"],
      total > 0 ? (present / total) * 100 : 0
    );

    return { total, present, absent, late, percentage };
  }, [records, stats]);

  const departments = useMemo(() => {
    return [
      ...new Set(records.map((item) => item.department).filter(Boolean)),
    ].sort();
  }, [records]);

  const filteredRecords = useMemo(() => {
    if (departmentFilter === "All") return records;

    return records.filter(
      (item) => item.department === departmentFilter
    );
  }, [records, departmentFilter]);

  const departmentSummary = useMemo(() => {
    const groups = {};

    records.forEach((record) => {
      const department = record.department || "Not specified";

      if (!groups[department]) {
        groups[department] = {
          department,
          total: 0,
          present: 0,
          absent: 0,
          late: 0,
        };
      }

      groups[department].total += 1;

      const status = String(record.status || "").toLowerCase();

      if (status === "present") groups[department].present += 1;
      if (status === "absent") groups[department].absent += 1;
      if (status === "late") groups[department].late += 1;
    });

    return Object.values(groups).map((item) => ({
      ...item,
      percentage:
        item.total > 0
          ? Math.round((item.present / item.total) * 100)
          : 0,
    }));
  }, [records]);

  function handleFormChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (
      !form.studentId.trim() ||
      !form.studentName.trim() ||
      !form.department.trim() ||
      !form.attendanceDate
    ) {
      setError("Please fill in all fields.");
      return;
    }

    const payload = {
      studentId: form.studentId.trim(),
      studentName: form.studentName.trim(),
      department: form.department.trim(),
      attendanceDate: form.attendanceDate,
      status: form.status,
    };

    setSaving(true);

    try {
      await addAttendance(payload);
      setMessage("Attendance record added successfully.");
      setDepartmentFilter("All");
      setForm(makeEmptyForm());

      if (payload.attendanceDate !== selectedDate) {
        setSelectedDate(payload.attendanceDate);
      } else {
        await loadAttendance();
      }
    } catch (err) {
      setError(err.message || "Unable to add attendance record.");
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(record) {
    const current = String(record.status || "").toLowerCase();

    const nextStatus =
      current === "present"
        ? "Absent"
        : current === "absent"
          ? "Late"
          : "Present";

    setError("");
    setMessage("");

    try {
      await updateAttendance(record.id, {
        studentId: record.studentId,
        studentName: record.studentName,
        department: record.department,
        attendanceDate: record.attendanceDate,
        status: nextStatus,
      });

      setMessage(
        `${record.studentName || "Student"} marked as ${nextStatus}.`
      );

      await loadAttendance();
    } catch (err) {
      setError(err.message || "Unable to update attendance.");
    }
  }

  async function handleDelete(record) {
    const confirmed = window.confirm(
      `Delete the attendance record for ${
        record.studentName || "this student"
      }?`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      await deleteAttendance(record.id);
      setMessage("Attendance record deleted successfully.");
      await loadAttendance();
    } catch (err) {
      setError(err.message || "Unable to delete attendance record.");
    }
  }

  return (
    <main
      style={{
        padding: "24px",
        maxWidth: "1400px",
        margin: "0 auto",
        color: "#172033",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>
        Attendance Management
      </h1>

      <p style={{ color: "#64748b", fontSize: "14px" }}>
        Manage student attendance and review daily attendance statistics.
      </p>

      {error && (
        <div
          role="alert"
          style={{
            background: "#fff1f2",
            color: "#be123c",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        >
          {error}
        </div>
      )}

      {message && (
        <div
          role="status"
          style={{
            background: "#f0fdf4",
            color: "#166534",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        >
          {message}
        </div>
      )}

      <section style={panelStyle}>
        <h2 style={{ fontSize: "19px", marginTop: 0 }}>Daily Overview</h2>

        <label
          htmlFor="selectedDate"
          style={{ display: "block", marginBottom: "8px", fontSize: "13px" }}
        >
          Select attendance date
        </label>

        <input
          id="selectedDate"
          type="date"
          value={selectedDate}
          onChange={(event) => {
            setSelectedDate(event.target.value);
            setMessage("");
          }}
          style={{ ...inputStyle, maxWidth: "250px" }}
        />
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "16px",
          marginBottom: "22px",
        }}
      >
        <StatCard label="Total Records" value={totals.total} color="#4f46e5" />
        <StatCard label="Present" value={totals.present} color="#16a34a" />
        <StatCard label="Absent" value={totals.absent} color="#dc2626" />
        <StatCard label="Late" value={totals.late} color="#d97706" />
        <StatCard
          label="Attendance Rate"
          value={`${totals.percentage.toFixed(1)}%`}
          color="#0891b2"
        />
      </section>

      <section style={panelStyle}>
        <h2 style={{ fontSize: "19px", marginTop: 0 }}>
          Add Attendance Record
        </h2>

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              gap: "16px",
            }}
          >
            <div>
              <label htmlFor="studentId">Student ID</label>
              <input
                id="studentId"
                name="studentId"
                value={form.studentId}
                onChange={handleFormChange}
                placeholder="Enter student ID"
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label htmlFor="studentName">Student Name</label>
              <input
                id="studentName"
                name="studentName"
                value={form.studentName}
                onChange={handleFormChange}
                placeholder="Enter student name"
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label htmlFor="department">Department</label>
              <input
                id="department"
                name="department"
                value={form.department}
                onChange={handleFormChange}
                placeholder="e.g. AIML"
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label htmlFor="formDate">Date</label>
              <input
                id="formDate"
                name="attendanceDate"
                type="date"
                value={form.attendanceDate}
                onChange={handleFormChange}
                style={inputStyle}
                required
              />
            </div>

            <div>
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleFormChange}
                style={inputStyle}
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late">Late</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{ ...primaryButtonStyle, marginTop: "18px" }}
          >
            {saving ? "Saving..." : "Add Attendance"}
          </button>
        </form>
      </section>

      <section style={panelStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "18px",
          }}
        >
          <div>
            <h2 style={{ fontSize: "19px", marginTop: 0 }}>
              Attendance Records
            </h2>
            <span style={{ color: "#64748b", fontSize: "13px" }}>
              {selectedDate} · {filteredRecords.length} record(s)
            </span>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <select
              aria-label="Filter by department"
              value={departmentFilter}
              onChange={(event) => setDepartmentFilter(event.target.value)}
              style={{ ...inputStyle, width: "auto" }}
            >
              <option value="All">All departments</option>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={loadAttendance}
              style={secondaryButtonStyle}
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <p>Loading attendance records...</p>
        ) : filteredRecords.length === 0 ? (
          <p style={{ color: "#64748b" }}>
            No attendance records found for this date.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={headerCellStyle}>Student ID</th>
                  <th style={headerCellStyle}>Student Name</th>
                  <th style={headerCellStyle}>Department</th>
                  <th style={headerCellStyle}>Date</th>
                  <th style={headerCellStyle}>Status</th>
                  <th style={headerCellStyle}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td style={cellStyle}>{record.studentId || "—"}</td>
                    <td style={cellStyle}>{record.studentName || "—"}</td>
                    <td style={cellStyle}>{record.department || "—"}</td>
                    <td style={cellStyle}>{record.attendanceDate || "—"}</td>
                    <td style={cellStyle}>
                      <span
                        style={{
                          ...getStatusStyle(record.status),
                          borderRadius: "20px",
                          padding: "5px 9px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        {record.status || "Unknown"}
                      </span>
                    </td>
                    <td style={cellStyle}>
                      <div style={{ display: "flex", gap: "7px" }}>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(record)}
                          style={secondaryButtonStyle}
                        >
                          Change Status
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(record)}
                          style={{
                            ...secondaryButtonStyle,
                            color: "#be123c",
                            borderColor: "#fecaca",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section style={panelStyle}>
        <h2 style={{ fontSize: "19px", marginTop: 0 }}>Department Summary</h2>

        {departmentSummary.length === 0 ? (
          <p style={{ color: "#64748b" }}>
            No department data available for this date.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={headerCellStyle}>Department</th>
                  <th style={headerCellStyle}>Total</th>
                  <th style={headerCellStyle}>Present</th>
                  <th style={headerCellStyle}>Absent</th>
                  <th style={headerCellStyle}>Late</th>
                  <th style={headerCellStyle}>Present Rate</th>
                </tr>
              </thead>

              <tbody>
                {departmentSummary.map((item) => (
                  <tr key={item.department}>
                    <td style={cellStyle}>{item.department}</td>
                    <td style={cellStyle}>{item.total}</td>
                    <td style={cellStyle}>{item.present}</td>
                    <td style={cellStyle}>{item.absent}</td>
                    <td style={cellStyle}>{item.late}</td>
                    <td style={cellStyle}>{item.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
