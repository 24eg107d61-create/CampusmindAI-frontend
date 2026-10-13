
const API_URL = "http://localhost:8080/api/canteen/items";

async function request(endpoint = "", options = {}) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            errorText || `Request failed with status ${response.status}`
        );
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

export function getFoodItems() {
    return request();
}

export function addFoodItem(item) {
    return request("", {
        method: "POST",
        body: JSON.stringify(item),
    });
}

export function updateFoodItem(id, item) {
    return request(`/${id}`, {
        method: "PUT",
        body: JSON.stringify(item),
    });
}

export function deleteFoodItem(id) {
    return request(`/${id}`, {
        method: "DELETE",
    });
}
