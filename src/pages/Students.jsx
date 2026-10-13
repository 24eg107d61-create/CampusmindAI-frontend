
import { useEffect, useState } from "react";
import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
} from "../services/studentService";

const emptyForm = {
  studentId: "",
  name: "",
  department: "",
  year: "",
  email: "",
  phone: "",
};

export default function Students() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadStudents = async () => {
    try {
      setError("");
      const data = await getStudents();
      setStudents(data);
    } catch (err) {
      setError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const student = {
      ...form,
      year: form.year ? Number(form.year) : null,
    };

    try {
      setError("");

      if (editingId !== null) {
        await updateStudent(editingId, student);
      } else {
        await addStudent(student);
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadStudents();
    } catch (err) {
      setError(err.message || "Failed to save student");
    }
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setForm({
      studentId: student.studentId || "",
      name: student.name || "",
      department: student.department || "",
      year: student.year ?? "",
      email: student.email || "",
      phone: student.phone || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      setError("");
      await deleteStudent(id);
      await loadStudents();
    } catch (err) {
      setError(err.message || "Failed to delete student");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  return (
    <div style={{ padding: "28px", color: "#1f2937" }}>
      <h1 style={{ marginBottom: "6px" }}>Student Management</h1>
      <p style={{ color: "#6b7280", marginTop: 0 }}>
        Register and manage student records.
      </p>

      {error && (
        <div
          role="alert"
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: "12px",
            borderRadius: "8px",
            margin: "16px 0",
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "14px",
          padding: "22px",
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          margin: "22px 0",
        }}
      >
        <h3 style={{ gridColumn: "1 / -1", margin: 0 }}>
          {editingId !== null ? "Edit Student" : "Register Student"}
        </h3>

        <input
          name="studentId"
          placeholder="Student ID"
          value={form.studentId}
          onChange={handleChange}
          required
          maxLength={30}
        />

        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          maxLength={100}
          pattern="[A-Za-z][A-Za-z .'-]*"
          title="Enter a name using letters, spaces, apostrophes, periods or hyphens."
        />

        <input
          name="department"
          placeholder="Department (e.g. AIML)"
          value={form.department}
          onChange={handleChange}
          maxLength={100}
        />

        <select
          name="year"
          value={form.year}
          onChange={handleChange}
        >
          <option value="">Select Year</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>

        <input
          name="email"
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          maxLength={150}
        />

        <input
          name="phone"
          type="tel"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          pattern="[0-9]{10}"
          title="Enter a 10-digit phone number."
          maxLength={10}
        />

        <div
          style={{
            gridColumn: "1 / -1",
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <button type="submit">
            {editingId !== null ? "Update Student" : "Add Student"}
          </button>

          {editingId !== null && (
            <button type="button" onClick={cancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2>Student Records ({students.length})</h2>

      {loading ? (
        <p>Loading students...</p>
      ) : students.length === 0 ? (
        <p>No students registered yet.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#ffffff",
            }}
          >
            <thead>
              <tr style={{ background: "#f3f4f6", textAlign: "left" }}>
                {[
                  "Student ID",
                  "Name",
                  "Department",
                  "Year",
                  "Email",
                  "Phone",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #e5e7eb",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  {[
                    student.studentId,
                    student.name,
                    student.department || "—",
                    student.year || "—",
                    student.email || "—",
                    student.phone || "—",
                  ].map((value, index) => (
                    <td
                      key={index}
                      style={{
                        padding: "12px",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      {value}
                    </td>
                  ))}

                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #e5e7eb",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleEdit(student)}
                    >
                      Edit
                    </button>{" "}
                    <button
                      type="button"
                      onClick={() => handleDelete(student.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
