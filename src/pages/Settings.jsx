
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Settings() {
    const navigate = useNavigate();

    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("user")) || {};
        } catch {
            return {};
        }
    });

    const [name, setName] = useState(user.name || "");
    const [email, setEmail] = useState(user.email || "");
    const [message, setMessage] = useState("");

    const handleSave = (event) => {
        event.preventDefault();

        const updatedUser = {
            ...user,
            name: name.trim(),
            email: email.trim()
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setMessage("Profile updated in this browser.");
    };

    return (
        <div className="module-page">
            <div className="module-header">
                <div>
                    <button
                        className="back-button"
                        onClick={() => navigate("/dashboard")}
                    >
                        ← Back to Dashboard
                    </button>

                    <h1>Settings</h1>
                    <p>Manage your CampusMind AI profile and preferences.</p>
                </div>

                <div className="module-header-icon">⚙️</div>
            </div>

            <div className="module-panel" style={{ maxWidth: "720px" }}>
                <div className="panel-title">
                    <div>
                        <h2>Profile Settings</h2>
                        <p>Update the details displayed in your account.</p>
                    </div>
                </div>

                <form onSubmit={handleSave} style={{ marginTop: "24px" }}>
                    <div style={{ marginBottom: "20px" }}>
                        <label
                            htmlFor="settings-name"
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                color: "#394355",
                                fontSize: "13px"
                            }}
                        >
                            Full Name
                        </label>

                        <input
                            id="settings-name"
                            type="text"
                            value={name}
                            onChange={(event) => {
                                setName(event.target.value);
                                setMessage("");
                            }}
                            required
                            maxLength={100}
                            style={{
                                width: "100%",
                                boxSizing: "border-box",
                                padding: "12px",
                                border: "1px solid #e1e6ef",
                                borderRadius: "8px"
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <label
                            htmlFor="settings-email"
                            style={{
                                display: "block",
                                marginBottom: "8px",
                                color: "#394355",
                                fontSize: "13px"
                            }}
                        >
                            Email Address
                        </label>

                        <input
                            id="settings-email"
                            type="email"
                            value={email}
                            onChange={(event) => {
                                setEmail(event.target.value);
                                setMessage("");
                            }}
                            required
                            style={{
                                width: "100%",
                                boxSizing: "border-box",
                                padding: "12px",
                                border: "1px solid #e1e6ef",
                                borderRadius: "8px"
                            }}
                        />
                    </div>

                    {message && (
                        <p
                            role="status"
                            style={{
                                color: "#15803d",
                                fontSize: "13px",
                                marginBottom: "16px"
                            }}
                        >
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        style={{
                            background: "#2563eb",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "8px",
                            padding: "12px 20px",
                            cursor: "pointer"
                        }}
                    >
                        Save Changes
                    </button>
                </form>
            </div>

            <div className="module-panel" style={{ maxWidth: "720px", marginTop: "20px" }}>
                <h2>Account Information</h2>
                <p style={{ color: "#7b8495", fontSize: "13px", marginTop: "10px" }}>
                    Your account is authenticated using the existing login
                    system. Password changes and profile updates in the
                    database have not been implemented yet.
                </p>
            </div>
        </div>
    );
}

export default Settings;
