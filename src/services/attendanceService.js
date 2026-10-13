
const API_URL = "https://campusmind-ai-backend-idm9.onrender.com/api/attendance";

// Get the JWT token saved after login.
function getToken() {
  return localStorage.getItem("token");
}

// Common request handler.
async function request(endpoint, options = {}) {
  const token = getToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    throw new Error(
      typeof data === "object" && data?.message
        ? data.message
        : typeof data === "string"
          ? data
          : `Request failed (${response.status})`
    );
  }

  return data;
}

// Get attendance records, optionally filtered by date.
export function getAttendance(date = "") {
  const query = date
    ? `?date=${encodeURIComponent(date)}`
    : "";

  return request(query);
}

// Add a new attendance record.
export function addAttendance(attendance) {
  return request("", {
    method: "POST",
    body: JSON.stringify(attendance),
  });
}

// Update an existing attendance record.
export function updateAttendance(id, attendance) {
  return request(`/${id}`, {
    method: "PUT",
    body: JSON.stringify(attendance),
  });
}

// Delete an attendance record.
export function deleteAttendance(id) {
  return request(`/${id}`, {
    method: "DELETE",
  });
}

// Get attendance statistics for a date.
export function getAttendanceStats(date) {
  const query = date
    ? `?date=${encodeURIComponent(date)}`
    : "";

  return request(`/stats${query}`);
}
