
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

function Register() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (!/^[\p{L}][\p{L}\s.'-]*$/u.test(name.trim())) {
            setError("Enter a valid name using letters only.");
            return;
        }

        if (password.length < 6) {
            setError("Password must contain at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            await registerUser({
                name: name.trim(),
                email: email.trim(),
                password
            });

            navigate("/login", {
                replace: true,
                state: { message: "Account created successfully. Please sign in." }
            });
        } catch (err) {
            setError(
                typeof err.response?.data === "string"
                    ? err.response.data
                    : err.response
                        ? "Registration failed. Please check your details."
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
                        YOUR CAMPUS. ONE PLATFORM.
                    </span>
                    <h1>
                        Make every
                        <br />
                        campus decision smarter.
                    </h1>
                    <p>
                        Create your account to explore campus analytics,
                        resource planning and intelligent insights.
                    </p>

                    <div className="auth-feature-list">
                        <div>✓ One connected campus workspace</div>
                        <div>✓ Attendance and resource analytics</div>
                        <div>✓ Insights for better planning</div>
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
                        GET STARTED
                    </span>

                    <h1>Create your account</h1>
                    <p className="auth-subtitle">
                        Enter your details to join CampusMind AI.
                    </p>

                    <form onSubmit={handleRegister}>
                        <label htmlFor="register-name">Full name</label>
                        <input
                            id="register-name"
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoComplete="name"
                            maxLength={100}
                            required
                        />

                        <label htmlFor="register-email">Email address</label>
                        <input
                            id="register-email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            required
                        />

                        <label htmlFor="register-password">Password</label>
                        <div className="auth-password-field">
                            <input
                                id="register-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="At least 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                minLength={6}
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

                        <label htmlFor="confirm-password">
                            Confirm password
                        </label>
                        <input
                            id="confirm-password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Re-enter your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            autoComplete="new-password"
                            required
                        />

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
                            {loading ? "Creating account..." : "Create account"}
                            {!loading && <span>→</span>}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Already have an account?{" "}
                        <Link to="/login">Sign in</Link>
                    </p>

                    <p className="auth-secure-note">
                        🔒 Your account is protected by secure authentication
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
