import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getApiErrorMessage } from "../services/api";
import { registerUser } from "../services/authService";

const initialForm = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    address: "",
    role: "WORKER"
};

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialForm);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const validate = () => {
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,20}$/;

        if (!formData.firstName.trim() || !formData.lastName.trim() ||
            !formData.email.trim() || !formData.address.trim()) {
            return "Please fill in all required fields.";
        }
        if (formData.firstName.trim().length > 30 || formData.lastName.trim().length > 30) {
            return "First and last names cannot exceed 30 characters.";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            return "Please enter a valid email address.";
        }
        if (formData.address.trim().length > 255) {
            return "Address cannot exceed 255 characters.";
        }
        if (!passwordPattern.test(formData.password)) {
            return "Password must be 8-20 characters with uppercase, lowercase, a number, and one of @ # $ % ^ & + = !.";
        }
        if (formData.password !== formData.confirmPassword) {
            return "Passwords do not match.";
        }
        if (!/^\d{10}$/.test(formData.phoneNumber)) {
            return "Phone number must contain exactly 10 digits.";
        }
        return "";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        const validationError = validate();

        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);
            const response = await registerUser({
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim(),
                password: formData.password,
                phoneNumber: formData.phoneNumber,
                address: formData.address.trim(),
                role: formData.role
            });
            setSuccess(response.data.message || "Account created successfully. You can now log in.");
            setFormData(initialForm);
            window.setTimeout(() => navigate("/login"), 1200);
        } catch (requestError) {
            setError(getApiErrorMessage(requestError, "Registration failed."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card auth-card border-0 shadow-sm">
                        <div className="card-body p-4 p-md-5">
                            <span className="eyebrow">Join WorkConnect</span>
                            <h1 className="h2 fw-bold mt-2">Create your account</h1>
                            <p className="text-secondary mb-4">Choose your role and start with a simple profile.</p>

                            {error && <div className="alert alert-danger">{error}</div>}
                            {success && <div className="alert alert-success">{success}</div>}

                            <form onSubmit={handleSubmit} noValidate>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label" htmlFor="firstName">First name</label>
                                        <input id="firstName" name="firstName" className="form-control" maxLength="30" value={formData.firstName} onChange={handleChange} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label" htmlFor="lastName">Last name</label>
                                        <input id="lastName" name="lastName" className="form-control" maxLength="30" value={formData.lastName} onChange={handleChange} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label" htmlFor="email">Email</label>
                                        <input id="email" name="email" type="email" className="form-control" value={formData.email} onChange={handleChange} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label" htmlFor="phoneNumber">Phone number</label>
                                        <input id="phoneNumber" name="phoneNumber" className="form-control" inputMode="numeric" maxLength="10" value={formData.phoneNumber} onChange={handleChange} />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label" htmlFor="address">Address</label>
                                        <textarea id="address" name="address" className="form-control" rows="2" maxLength="255" value={formData.address} onChange={handleChange} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label" htmlFor="password">Password</label>
                                        <input id="password" name="password" type="password" className="form-control" value={formData.password} onChange={handleChange} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label" htmlFor="confirmPassword">Confirm password</label>
                                        <input id="confirmPassword" name="confirmPassword" type="password" className="form-control" value={formData.confirmPassword} onChange={handleChange} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label" htmlFor="role">Register as</label>
                                        <select id="role" name="role" className="form-select" value={formData.role} onChange={handleChange}>
                                            <option value="WORKER">Worker</option>
                                            <option value="EMPLOYER">Employer</option>
                                        </select>
                                    </div>
                                </div>
                                <p className="form-text mt-3">
                                    Password: 8-20 characters with uppercase, lowercase, number, and a supported special character.
                                </p>
                                <button className="btn btn-primary w-100 mt-2" disabled={loading}>
                                    {loading ? "Creating account..." : "Create Account"}
                                </button>
                            </form>
                            <p className="text-center text-secondary mt-4 mb-0">
                                Already registered? <Link to="/login">Login</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
