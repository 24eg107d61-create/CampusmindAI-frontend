import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

// Register user
export const registerUser = async (userData) => {
    const response = await axios.post(
        `${API_URL}/register`,
        userData
    );

    return response.data;
};

// Login user
export const loginUser = async (userData) => {
    const response = await axios.post(
        `${API_URL}/login`,
        userData
    );

    return response.data;
};

// Save JWT token
export const saveToken = (token) => {
    localStorage.setItem("token", token);
};

// Get JWT token
export const getToken = () => {
    return localStorage.getItem("token");
};

// Remove JWT token
export const logoutUser = () => {
    localStorage.removeItem("token");
};

// Check whether user is logged in
export const isLoggedIn = () => {
    return !!localStorage.getItem("token");
};