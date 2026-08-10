import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage } from "../services/api";
import { loginUser } from "../services/authService";

function Login() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [notice, setNotice] = useState(() => {
        if (searchParams.get("session") !== "expired") {
            return "";
        }

        const message = sessionStorage.getItem("workconnect_session_message") ||
            "Your session has expired. Please log in again.";
        sessionStorage.removeItem("workconnect_session_message");
        return message;
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setNotice("");

        if (!formData.email.trim() || !formData.password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);
            const response = await loginUser({
                email: formData.email.trim(),
                password: formData.password
            });
            const userData = login(response.data.token);

            if (!userData) {
                setError("The login token could not be processed. Please try again.");
                return;
            }

            navigate(
                userData.role === "EMPLOYER"
                    ? "/employer/dashboard"
                    : "/worker/dashboard"
            );
        } catch (requestError) {
            setError(getApiErrorMessage(requestError, "Invalid email or password."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-7 col-lg-5">
                    <div className="card auth-card border-0 shadow-sm">
                        <div className="card-body p-4 p-md-5">
                            <span className="eyebrow">Welcome back</span>
                            <h1 className="h2 fw-bold mt-2">Login to WorkConnect</h1>
                            <p className="text-secondary mb-4">Continue managing your work and opportunities.</p>

                            {notice && <div className="alert alert-warning">{notice}</div>}
                            {error && <div className="alert alert-danger">{error}</div>}

                            <form onSubmit={handleSubmit} noValidate>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email address</label>
                                    <input
                                        id="email"
                                        type="email"
                                        className="form-control"
                                        value={formData.email}
                                        onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                                        autoComplete="email"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input
                                        id="password"
                                        type="password"
                                        className="form-control"
                                        value={formData.password}
                                        onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                                        autoComplete="current-password"
                                    />
                                </div>
                                <button className="btn btn-primary w-100" disabled={loading}>
                                    {loading ? "Logging in..." : "Login"}
                                </button>
                            </form>

                            <p className="text-center text-secondary mt-4 mb-0">
                                New to WorkConnect? <Link to="/register">Create an account</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
