import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Classrooms from "./pages/Classrooms";
import Students from "./pages/Students";
import Library from "./pages/Library";
import Canteen from "./pages/Canteen";
import Settings from "./pages/Settings";

import ProtectRoute from "./components/ProtectRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Default route */}
                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

                {/* Authentication */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Dashboard */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectRoute>
                            <Dashboard />
                        </ProtectRoute>
                    }
                />

                {/* Attendance */}
                <Route
                    path="/attendance"
                    element={
                        <ProtectRoute>
                            <Attendance />
                        </ProtectRoute>
                    }
                />

                {/* Classrooms */}
                <Route
                    path="/classrooms"
                    element={
                        <ProtectRoute>
                            <Classrooms />
                        </ProtectRoute>
                    }
                />

                {/* Students */}
                <Route
                    path="/students"
                    element={
                        <ProtectRoute>
                            <Students />
                        </ProtectRoute>
                    }
                />

                {/* Library */}
                <Route
                    path="/library"
                    element={
                        <ProtectRoute>
                            <Library />
                        </ProtectRoute>
                    }
                />

                {/* Canteen */}
                <Route
                    path="/canteen"
                    element={
                        <ProtectRoute>
                            <Canteen />
                        </ProtectRoute>
                    }
                />

                {/* Settings */}
                <Route
                    path="/settings"
                    element={
                        <ProtectRoute>
                            <Settings />
                        </ProtectRoute>
                    }
                />

                {/* Unknown routes */}
                <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;