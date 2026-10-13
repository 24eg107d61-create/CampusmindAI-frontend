
const API_URL = "https://campusmind-ai-backend-idm9.onrender.com/api/classrooms";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getClassrooms = async () => {
  const response = await fetch(API_URL, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch classrooms");
  }

  return response.json();
};

export const addClassroom = async (classroom) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(classroom),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to add classroom");
  }

  return response.json();
};

export const updateClassroom = async (id, classroom) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(classroom),
  });

  if (!response.ok) {
    throw new Error("Failed to update classroom");
  }

  return response.json();
};

export const deleteClassroom = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete classroom");
  }
};
