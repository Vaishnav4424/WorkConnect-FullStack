import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { registerUser } from "../services/authService";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        address: "",
        role: "WORKER"
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);


    // Handle input change
    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };


    // Handle registration
    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        // ================= VALIDATION =================

        if (
            !formData.firstName ||
            !formData.lastName ||
            !formData.email ||
            !formData.password ||
            !formData.confirmPassword ||
            !formData.phoneNumber ||
            !formData.address ||
            !formData.role
        ) {
            setError("Please fill all required fields.");
            return;
        }


        // Password match
        if (
            formData.password !==
            formData.confirmPassword
        ) {
            setError("Passwords do not match.");
            return;
        }


        // Password validation
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,20}$/;

        if (!passwordRegex.test(formData.password)) {

            setError(
                "Password must contain 8-20 characters with at least one uppercase letter, one lowercase letter, one digit, and one special character."
            );

            return;
        }


        // Phone number validation
        const phoneRegex = /^[0-9]{10}$/;

        if (!phoneRegex.test(formData.phoneNumber)) {

            setError(
                "Phone number must contain exactly 10 digits."
            );

            return;
        }


        try {

            setLoading(true);


            // ================= REQUEST DATA =================
            // confirmPassword is NOT sent to backend

            const registrationData = {

                firstName: formData.firstName,

                lastName: formData.lastName,

                email: formData.email,

                password: formData.password,

                phoneNumber: formData.phoneNumber,

                address: formData.address,

                role: formData.role

            };


            console.log(
                "Registration Data:",
                registrationData
            );


            // Call Spring Boot API
            const response =
                await registerUser(registrationData);


            console.log(
                "Registration Response:",
                response.data
            );


            // Success message
            setSuccess(
                response.data.message ||
                "User registered successfully."
            );


            // Clear form
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                confirmPassword: "",
                phoneNumber: "",
                address: "",
                role: "WORKER"
            });


            // Redirect to login
            setTimeout(() => {

                navigate("/login");

            }, 1500);


        } catch (error) {

            console.error(
                "Registration Error:",
                error
            );


            if (error.response) {

                console.error(
                    "Backend Response:",
                    error.response.data
                );


                setError(
                    error.response.data?.message ||
                    "Registration failed."
                );

            } else {

                setError(
                    "Unable to connect to the server. Please make sure the backend is running."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    return (
        <>
            <Navbar />

            <div className="container">

                <div className="row justify-content-center py-5">

                    <div className="col-md-8 col-lg-7">

                        <div className="card shadow border-0">

                            <div className="card-body p-5">


                                {/* ================= HEADER ================= */}

                                <div className="text-center mb-4">

                                    <h2 className="fw-bold">
                                        Create Your Account
                                    </h2>

                                    <p className="text-muted">
                                        Join WorkConnect today
                                    </p>

                                </div>


                                {/* ================= ERROR ================= */}

                                {error && (
                                    <div
                                        className="alert alert-danger"
                                        role="alert"
                                    >
                                        {error}
                                    </div>
                                )}


                                {/* ================= SUCCESS ================= */}

                                {success && (
                                    <div
                                        className="alert alert-success"
                                        role="alert"
                                    >
                                        {success}
                                    </div>
                                )}


                                {/* ================= FORM ================= */}

                                <form onSubmit={handleSubmit}>


                                    {/* FIRST NAME + LAST NAME */}

                                    <div className="row">

                                        <div className="col-md-6 mb-3">

                                            <label
                                                htmlFor="firstName"
                                                className="form-label fw-semibold"
                                            >
                                                First Name
                                            </label>

                                            <input
                                                type="text"
                                                id="firstName"
                                                name="firstName"
                                                className="form-control"
                                                placeholder="Enter first name"
                                                value={
                                                    formData.firstName
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                maxLength="30"
                                                required
                                            />

                                        </div>


                                        <div className="col-md-6 mb-3">

                                            <label
                                                htmlFor="lastName"
                                                className="form-label fw-semibold"
                                            >
                                                Last Name
                                            </label>

                                            <input
                                                type="text"
                                                id="lastName"
                                                name="lastName"
                                                className="form-control"
                                                placeholder="Enter last name"
                                                value={
                                                    formData.lastName
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                maxLength="30"
                                                required
                                            />

                                        </div>

                                    </div>


                                    {/* EMAIL */}

                                    <div className="mb-3">

                                        <label
                                            htmlFor="email"
                                            className="form-label fw-semibold"
                                        >
                                            Email Address
                                        </label>

                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            className="form-control"
                                            placeholder="Enter email address"
                                            value={
                                                formData.email
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>


                                    {/* PHONE NUMBER */}

                                    <div className="mb-3">

                                        <label
                                            htmlFor="phoneNumber"
                                            className="form-label fw-semibold"
                                        >
                                            Phone Number
                                        </label>

                                        <input
                                            type="tel"
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            className="form-control"
                                            placeholder="Enter 10-digit phone number"
                                            value={
                                                formData.phoneNumber
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            maxLength="10"
                                            pattern="[0-9]{10}"
                                            required
                                        />

                                    </div>


                                    {/* ADDRESS */}

                                    <div className="mb-3">

                                        <label
                                            htmlFor="address"
                                            className="form-label fw-semibold"
                                        >
                                            Address
                                        </label>

                                        <textarea
                                            id="address"
                                            name="address"
                                            className="form-control"
                                            rows="3"
                                            placeholder="Enter your address"
                                            value={
                                                formData.address
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            maxLength="255"
                                            required
                                        />

                                    </div>


                                    {/* PASSWORD */}

                                    <div className="mb-3">

                                        <label
                                            htmlFor="password"
                                            className="form-label fw-semibold"
                                        >
                                            Password
                                        </label>

                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            className="form-control"
                                            placeholder="Enter password"
                                            value={
                                                formData.password
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                        <small className="text-muted">
                                            8-20 characters, including
                                            uppercase, lowercase, number
                                            and special character.
                                        </small>

                                    </div>


                                    {/* CONFIRM PASSWORD */}

                                    <div className="mb-3">

                                        <label
                                            htmlFor="confirmPassword"
                                            className="form-label fw-semibold"
                                        >
                                            Confirm Password
                                        </label>

                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            className="form-control"
                                            placeholder="Confirm password"
                                            value={
                                                formData.confirmPassword
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>


                                    {/* ROLE */}

                                    <div className="mb-4">

                                        <label
                                            htmlFor="role"
                                            className="form-label fw-semibold"
                                        >
                                            Register As
                                        </label>

                                        <select
                                            id="role"
                                            name="role"
                                            className="form-select"
                                            value={
                                                formData.role
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        >

                                            <option value="WORKER">
                                                Worker
                                            </option>

                                            <option value="EMPLOYER">
                                                Employer
                                            </option>

                                        </select>

                                    </div>


                                    {/* SUBMIT */}

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 py-2"
                                        disabled={loading}
                                    >

                                        {loading
                                            ? "Creating Account..."
                                            : "Create Account"
                                        }

                                    </button>

                                </form>


                                {/* LOGIN LINK */}

                                <div className="text-center mt-4">

                                    <p className="mb-0 text-muted">

                                        Already have an account?{" "}

                                        <Link
                                            to="/login"
                                            className="text-decoration-none fw-semibold"
                                        >
                                            Login
                                        </Link>

                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </>
    );
}

export default Register;