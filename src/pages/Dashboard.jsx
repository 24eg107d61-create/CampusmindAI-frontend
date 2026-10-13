import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import { getAttendanceStats } from "../services/attendanceService";
import { getClassrooms } from "../services/classroomService";

function Dashboard() {
    const navigate = useNavigate();

    const [showNotifications, setShowNotifications] = useState(false);
    const [attendanceStats, setAttendanceStats] = useState(null);
    const [classrooms, setClassrooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dataError, setDataError] = useState("");

    let user = {};

    try {
        user = JSON.parse(localStorage.getItem("user")) || {};
    } catch {
        user = {};
    }

    const firstName = user.name || "Administrator";

    useEffect(() => {
        let cancelled = false;

        async function loadDashboard() {
            setLoading(true);
            setDataError("");

            const results = await Promise.allSettled([
                getAttendanceStats(),
                getClassrooms(),
            ]);

            if (cancelled) return;

            if (results[0].status === "fulfilled") {
                setAttendanceStats(results[0].value);
            }

            if (results[1].status === "fulfilled") {
                setClassrooms(results[1].value);
            }

            const errors = results
                .map((result, index) =>
                    result.status === "rejected"
                        ? index === 0
                            ? "attendance"
                            : "classroom"
                        : null
                )
                .filter(Boolean);

            if (errors.length > 0) {
                setDataError(
                    `Unable to load ${errors.join(
                        " and "
                    )} data. Check your backend connection and login session.`
                );
            }

            setLoading(false);
        }

        loadDashboard();

        return () => {
            cancelled = true;
        };
    }, []);

    const handleLogout = () => {
        logoutUser();
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
    };

    // Sidebar navigation: removed Complaints and Infrastructure.
    const sidebarItems = [
        { title: "Dashboard", icon: "📊", path: "/dashboard" },
        { title: "Attendance", icon: "👥", path: "/attendance" },
        { title: "Classrooms", icon: "🏫", path: "/classrooms" },
        { title: "Students", icon: "🎓", path: "/students" },
        { title: "Library", icon: "📚", path: "/library" },
        { title: "Canteen", icon: "🍽️", path: "/canteen" },
    ];

    // Dashboard module cards: only active modules remain.
    const modules = [
        {
            title: "Attendance",
            description: "Student attendance analytics",
            icon: "👥",
            color: "blue",
            action: "View Analytics →",
            path: "/attendance",
        },
        {
            title: "Classrooms",
            description: "Space utilization monitoring",
            icon: "🏫",
            color: "purple",
            action: "View Analytics →",
            path: "/classrooms",
        },
        {
            title: "Students",
            description: "Student registration and records",
            icon: "🎓",
            color: "blue",
            action: "Manage Students →",
            path: "/students",
        },
        {
            title: "Library",
            description: "Usage and visitor analytics",
            icon: "📚",
            color: "green",
            action: "View Analytics →",
            path: "/library",
        },
        {
            title: "Canteen",
            description: "Demand and consumption trends",
            icon: "🍽️",
            color: "orange",
            action: "View Analytics →",
            path: "/canteen",
        },
    ];

    const attendanceRate = Number(
        attendanceStats?.attendanceRate ?? 0
    );

    const totalAttendanceRecords = Number(
        attendanceStats?.todayRecords ?? 0
    );

    const presentCount = Number(attendanceStats?.present ?? 0);
    const lateCount = Number(attendanceStats?.late ?? 0);
    const absentCount = Number(attendanceStats?.absent ?? 0);

    const availableClassrooms = classrooms.filter(
        (classroom) =>
            String(classroom.availability || "").toLowerCase() ===
            "available"
    ).length;

    const occupiedClassrooms = classrooms.filter(
        (classroom) =>
            String(classroom.availability || "").toLowerCase() ===
            "occupied"
    ).length;

    const classroomUtilization =
        classrooms.length > 0
            ? Math.round(
                  (occupiedClassrooms / classrooms.length) * 100
              )
            : 0;

    // Removed the Open Complaints statistic.
    const statCards = [
        {
            title: "Attendance Rate",
            value: `${attendanceRate}%`,
            icon: "👥",
            color: "blue",
            detail:
                totalAttendanceRecords > 0
                    ? `${presentCount + lateCount} present or late out of ${totalAttendanceRecords}`
                    : "No attendance records today",
        },
        {
            title: "Classroom Utilization",
            value: `${classroomUtilization}%`,
            icon: "🏫",
            color: "purple",
            detail: `${occupiedClassrooms} occupied · ${availableClassrooms} available`,
        },
        {
            title: "Library Visits",
            value: "0",
            icon: "📚",
            color: "green",
            detail: "Waiting for library data",
        },
    ];

    return (
        <div className="dashboard">
            <aside className="sidebar">
                <div className="brand">
                    <div className="brand-icon">CM</div>
                    <div>
                        <h2>CampusMind</h2>
                        <span>AI PLATFORM</span>
                    </div>
                </div>

                <div className="menu-title">MAIN MENU</div>

                <nav className="sidebar-menu">
                    {sidebarItems.map((item) => (
                        <button
                            key={item.path}
                            type="button"
                            className={`menu-item ${
                                item.path === "/dashboard" ? "active" : ""
                            }`}
                            onClick={() => navigate(item.path)}
                        >
                            <span>{item.icon}</span>
                            {item.title}
                        </button>
                    ))}
                </nav>

                <div className="sidebar-bottom">
                    <button
                        type="button"
                        className="menu-item"
                        onClick={() => navigate("/settings")}
                    >
                        <span>⚙️</span>
                        Settings
                    </button>

                    <button
                        type="button"
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        <span>🚪</span>
                        Logout
                    </button>
                </div>
            </aside>

            <main className="main-area">
                <header className="topbar">
                    <div className="page-title">
                        <h1>Dashboard</h1>
                        <p>Smart Campus Resource Intelligence</p>
                    </div>

                    <div className="topbar-right">
                        <div style={{ position: "relative" }}>
                            <button
                                type="button"
                                className="notification-btn"
                                aria-label="Notifications"
                                aria-expanded={showNotifications}
                                onClick={() =>
                                    setShowNotifications((previous) => !previous)
                                }
                            >
                                🔔
                                <span />
                            </button>

                            {showNotifications && (
                                <div
                                    style={{
                                        position: "absolute",
                                        right: 0,
                                        top: "45px",
                                        width: "260px",
                                        padding: "16px",
                                        background: "#ffffff",
                                        color: "#172033",
                                        border: "1px solid #e5e7eb",
                                        borderRadius: "10px",
                                        boxShadow: "0 8px 24px #00000012",
                                        zIndex: 20,
                                    }}
                                >
                                    <strong>Notifications</strong>

                                    <p
                                        style={{
                                            marginTop: "12px",
                                            fontSize: "13px",
                                        }}
                                    >
                                        {totalAttendanceRecords === 0
                                            ? "No attendance records for today."
                                            : `Today's attendance records: ${totalAttendanceRecords}.`}
                                    </p>

                                    <p
                                        style={{
                                            marginTop: "10px",
                                            fontSize: "13px",
                                        }}
                                    >
                                        🏫 {classrooms.length} classrooms registered.
                                    </p>

                                    <p
                                        style={{
                                            marginTop: "10px",
                                            fontSize: "13px",
                                        }}
                                    >
                                        📚 Library statistics are not connected yet.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="profile">
                            <div className="profile-avatar">
                                {firstName.charAt(0).toUpperCase()}
                            </div>
                            <div className="profile-info">
                                <strong>{firstName}</strong>
                                <small>Administrator</small>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="dashboard-content">
                    <section className="welcome">
                        <div>
                            <h2>Good morning, {firstName} 👋</h2>
                            <p>
                                Here's what's happening across your campus today.
                            </p>
                        </div>

                        <div className="date-box">
                            <span>📅</span>
                            <div>
                                <small>Today</small>
                                <strong>Campus Overview</strong>
                            </div>
                        </div>
                    </section>

                    {dataError && (
                        <p role="alert" style={{ color: "#b91c1c" }}>
                            {dataError}
                        </p>
                    )}

                    <section className="stats-grid">
                        {statCards.map((card) => (
                            <div className="stat-card" key={card.title}>
                                <div className="stat-top">
                                    <span className="stat-label">
                                        {card.title}
                                    </span>
                                    <div className={`stat-icon ${card.color}`}>
                                        {card.icon}
                                    </div>
                                </div>

                                <h2>{loading ? "..." : card.value}</h2>
                                <p>
                                    <span>
                                        {loading ? "Loading data..." : card.detail}
                                    </span>
                                </p>
                            </div>
                        ))}
                    </section>

                    <section className="main-grid">
                        <div className="panel chart-panel">
                            <div className="panel-header">
                                <div>
                                    <h3>Attendance Overview</h3>
                                    <p>Today's attendance records</p>
                                </div>
                            </div>

                            <div className="chart-placeholder">
                                {loading ? (
                                    <p>Loading attendance data...</p>
                                ) : totalAttendanceRecords === 0 ? (
                                    <p>
                                        No attendance records available for today.
                                    </p>
                                ) : (
                                    <div
                                        style={{
                                            width: "100%",
                                            padding: "20px",
                                        }}
                                    >
                                        <p>Present: {presentCount}</p>
                                        <p>Late: {lateCount}</p>
                                        <p>Absent: {absentCount}</p>
                                        <p>
                                            Attendance rate: {attendanceRate}%
                                        </p>

                                        <div
                                            style={{
                                                display: "flex",
                                                height: "16px",
                                                width: "100%",
                                                overflow: "hidden",
                                                borderRadius: "8px",
                                                background: "#e5e7eb",
                                                marginTop: "16px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: `${
                                                        totalAttendanceRecords
                                                            ? Math.min(
                                                                  100,
                                                                  (presentCount /
                                                                      totalAttendanceRecords) *
                                                                      100
                                                              )
                                                            : 0
                                                    }%`,
                                                    background: "#16a34a",
                                                }}
                                            />

                                            <div
                                                style={{
                                                    width: `${
                                                        totalAttendanceRecords
                                                            ? Math.min(
                                                                  100,
                                                                  (lateCount /
                                                                      totalAttendanceRecords) *
                                                                      100
                                                              )
                                                            : 0
                                                    }%`,
                                                    background: "#f59e0b",
                                                }}
                                            />

                                            <div
                                                style={{
                                                    width: `${
                                                        totalAttendanceRecords
                                                            ? Math.min(
                                                                  100,
                                                                  (absentCount /
                                                                      totalAttendanceRecords) *
                                                                      100
                                                              )
                                                            : 0
                                                    }%`,
                                                    background: "#ef4444",
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="panel insights-panel">
                            <div className="panel-header">
                                <div>
                                    <h3>🤖 Campus Insights</h3>
                                    <p>Based on currently available data</p>
                                </div>
                                <span className="ai-badge">DATA SUMMARY</span>
                            </div>

                            <div className="insight-card prediction">
                                <div className="insight-icon">📊</div>
                                <div>
                                    <strong>Attendance Summary</strong>
                                    <p>
                                        {loading
                                            ? "Loading attendance data..."
                                            : `${attendanceRate}% attendance rate from ${totalAttendanceRecords} records today.`}
                                    </p>
                                </div>
                            </div>

                            <div className="insight-card warning">
                                <div className="insight-icon">🏫</div>
                                <div>
                                    <strong>Classroom Status</strong>
                                    <p>
                                        {loading
                                            ? "Loading classrooms..."
                                            : `${occupiedClassrooms} occupied and ${availableClassrooms} available classrooms out of ${classrooms.length}.`}
                                    </p>
                                </div>
                            </div>

                            <div className="insight-card success">
                                <div className="insight-icon">💡</div>
                                <div>
                                    <strong>Data Availability</strong>
                                    <p>
                                        Library visit analytics will appear once
                                        the library module is connected to real
                                        data.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="modules-section">
                        <div className="section-header">
                            <div>
                                <h3>Campus Modules</h3>
                                <p>Monitor and manage campus resources</p>
                            </div>

                            <button
                                type="button"
                                className="view-all"
                                onClick={() => navigate("/attendance")}
                            >
                                View All →
                            </button>
                        </div>

                        <div className="module-grid">
                            {modules.map((module) => (
                                <button
                                    type="button"
                                    className="module-card"
                                    key={module.path}
                                    onClick={() => navigate(module.path)}
                                >
                                    <div
                                        className={`module-icon ${module.color}`}
                                    >
                                        {module.icon}
                                    </div>
                                    <h4>{module.title}</h4>
                                    <p>{module.description}</p>
                                    <span>{module.action}</span>
                                </button>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;