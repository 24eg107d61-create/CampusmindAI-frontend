
import { useEffect, useState } from "react";
import {
  getClassrooms,
  addClassroom,
  updateClassroom,
  deleteClassroom,
} from "../services/classroomService";

export default function Classrooms() {
  const [classrooms, setClassrooms] = useState([]);
  const [form, setForm] = useState({
    roomNumber: "",
    building: "",
    capacity: "",
    availability: "Available",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const loadClassrooms = async () => {
    try {
      const data = await getClassrooms();
      setClassrooms(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClassrooms();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      roomNumber: "",
      building: "",
      capacity: "",
      availability: "Available",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const classroom = {
      ...form,
      capacity: Number(form.capacity),
    };

    try {
      if (editingId !== null) {
        await updateClassroom(editingId, classroom);
        setMessage("Classroom updated successfully!");
      } else {
        await addClassroom(classroom);
        setMessage("Classroom added successfully!");
      }

      resetForm();
      await loadClassrooms();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleEdit = (classroom) => {
    setEditingId(classroom.id);
    setForm({
      roomNumber: classroom.roomNumber,
      building: classroom.building,
      capacity: String(classroom.capacity),
      availability: classroom.availability,
    });
    setMessage("");
  };

  const handleAvailability = async (classroom) => {
    const updated = {
      roomNumber: classroom.roomNumber,
      building: classroom.building,
      capacity: classroom.capacity,
      availability:
        classroom.availability === "Available" ? "Occupied" : "Available",
    };

    try {
      await updateClassroom(classroom.id, updated);
      setMessage("Availability updated successfully!");
      await loadClassrooms();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this classroom?")) {
      return;
    }

    try {
      await deleteClassroom(id);
      if (editingId === id) resetForm();
      setMessage("Classroom deleted successfully!");
      await loadClassrooms();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div style={styles.page}>
      <h1>Classroom Management</h1>
      <p style={styles.subtitle}>
        Add, manage, and monitor classroom availability.
      </p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>{editingId !== null ? "Edit Classroom" : "Add Classroom"}</h2>

        <div style={styles.fields}>
          <input
            name="roomNumber"
            placeholder="Room Number (e.g. A101)"
            value={form.roomNumber}
            onChange={handleChange}
            required
          />

          <input
            name="building"
            placeholder="Building Name"
            value={form.building}
            onChange={handleChange}
            required
          />

          <input
            name="capacity"
            type="number"
            placeholder="Capacity"
            min="1"
            value={form.capacity}
            onChange={handleChange}
            required
          />

          <select
            name="availability"
            value={form.availability}
            onChange={handleChange}
          >
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
          </select>
        </div>

        <div style={styles.actions}>
          <button type="submit" style={styles.primaryButton}>
            {editingId !== null ? "Save Changes" : "Add Classroom"}
          </button>

          {editingId !== null && (
            <button
              type="button"
              onClick={resetForm}
              style={styles.secondaryButton}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {message && <p style={styles.message}>{message}</p>}

      <div style={styles.tableContainer}>
        <h2>Classroom Records</h2>

        {loading ? (
          <p>Loading classrooms...</p>
        ) : classrooms.length === 0 ? (
          <p>No classrooms added yet.</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.cell}>Room</th>
                <th style={styles.cell}>Building</th>
                <th style={styles.cell}>Capacity</th>
                <th style={styles.cell}>Availability</th>
                <th style={styles.cell}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {classrooms.map((classroom) => (
                <tr key={classroom.id}>
                  <td style={styles.cell}>{classroom.roomNumber}</td>
                  <td style={styles.cell}>{classroom.building}</td>
                  <td style={styles.cell}>{classroom.capacity}</td>
                  <td style={styles.cell}>
                    <span
                      style={{
                        ...styles.status,
                        backgroundColor:
                          classroom.availability === "Available"
                            ? "#dcfce7"
                            : "#fee2e2",
                        color:
                          classroom.availability === "Available"
                            ? "#166534"
                            : "#991b1b",
                      }}
                    >
                      {classroom.availability}
                    </span>
                  </td>
                  <td style={styles.cell}>
                    <div style={styles.rowActions}>
                      <button
                        onClick={() => handleEdit(classroom)}
                        style={styles.editButton}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleAvailability(classroom)}
                        style={styles.statusButton}
                      >
                        Toggle Status
                      </button>
                      <button
                        onClick={() => handleDelete(classroom.id)}
                        style={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "28px",
    color: "inherit",
  },
  subtitle: {
    opacity: 0.7,
    marginBottom: "24px",
  },
  form: {
    padding: "22px",
    border: "1px solid #d1d5db",
    borderRadius: "12px",
    marginBottom: "20px",
  },
  fields: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
    marginTop: "16px",
  },
  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "16px",
  },
  primaryButton: {
    padding: "10px 16px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "10px 16px",
    border: "1px solid #9ca3af",
    borderRadius: "6px",
    cursor: "pointer",
  },
  message: {
    margin: "16px 0",
    fontWeight: "500",
  },
  tableContainer: {
    overflowX: "auto",
    padding: "20px",
    border: "1px solid #d1d5db",
    borderRadius: "12px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "16px",
  },
  cell: {
    padding: "12px",
    textAlign: "left",
    borderBottom: "1px solid #d1d5db",
    whiteSpace: "nowrap",
  },
  status: {
    padding: "5px 9px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },
  rowActions: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
  },
  editButton: {
    padding: "6px 9px",
    cursor: "pointer",
  },
  statusButton: {
    padding: "6px 9px",
    cursor: "pointer",
  },
  deleteButton: {
    padding: "6px 9px",
    color: "#dc2626",
    cursor: "pointer",
  },
};
