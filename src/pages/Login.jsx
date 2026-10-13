
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, saveToken } from "../services/authService";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = await loginUser({
                email: email.trim(),
                password
            });

            saveToken(data.token);

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            navigate("/dashboard", { replace: true });
        } catch (err) {
            setError(
                typeof err.response?.data === "string"
                    ? err.response.data
                    : err.response
                        ? "Login failed. Please check your details."
                        : "Cannot connect to the server. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-visual">
                <div className="auth-brand">
                    <span className="auth-logo">CM</span>
                    <div>
                        <h2>CampusMind AI</h2>
                        <p>SMART CAMPUS INTELLIGENCE</p>
                    </div>
                </div>

                <div className="auth-visual-content">
                    <span className="auth-eyebrow">
                        INTELLIGENCE FOR BETTER CAMPUSES
                    </span>
                    <h1>
                        A smarter campus
                        <br />
                        starts here.
                    </h1>
                    <p>
                        Bring attendance, classrooms, library resources
                        and campus operations together in one intelligent
                        platform.
                    </p>

                    <div className="auth-feature-list">
                        <div>✓ Real-time campus insights</div>
                        <div>✓ Centralized resource management</div>
                        <div>✓ Data-driven decisions</div>
                    </div>
                </div>

                <p className="auth-footer">
                    CampusMind AI · Smart Campus Resource Planning
                </p>
            </div>

            <div className="auth-form-side">
                <div className="auth-form-card">
                    <div className="auth-mobile-brand">
                        <span className="auth-logo">CM</span>
                        <strong>CampusMind AI</strong>
                    </div>

                    <span className="auth-eyebrow">
                        WELCOME BACK
                    </span>

                    <h1>Sign in to your account</h1>
                    <p className="auth-subtitle">
                        Enter your details to access your campus dashboard.
                    </p>

                    <form onSubmit={handleLogin}>
                        <label htmlFor="login-email">Email address</label>
                        <input
                            id="login-email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                        />

                        <div className="auth-password-heading">
                            <label htmlFor="login-password">Password</label>
                        </div>

                        <div className="auth-password-field">
                            <input
                                id="login-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                required
                            />
                            <button
                                type="button"
                                className="auth-show-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>

                        {error && (
                            <div className="auth-error" role="alert">
                                {error}
                            </div>
                        )}

                        <button
                            className="auth-submit"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign in"}
                            {!loading && <span>→</span>}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Don't have an account?{" "}
                        <Link to="/register">Create an account</Link>
                    </p>

                    <p className="auth-secure-note">
                        🔒 Secure access to your campus workspace
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
