
const API_URL = "http://localhost:8080/api/students";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getStudents = async () => {
  const response = await fetch(API_URL, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch students");
  }

  return response.json();
};

export const addStudent = async (student) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(student),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to add student");
  }

  return response.json();
};

export const updateStudent = async (id, student) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(student),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to update student");
  }

  return response.json();
};

export const deleteStudent = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete student");
  }
};
