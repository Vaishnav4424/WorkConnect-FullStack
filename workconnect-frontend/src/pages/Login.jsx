import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Login() {

    const navigate = useNavigate();

    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    // ================= HANDLE INPUT =================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

    };


    // ================= HANDLE LOGIN =================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");


        // ================= REQUIRED VALIDATION =================

        if (!formData.email || !formData.password) {

            setError(
                "Please enter email and password."
            );

            return;
        }


        // ================= PASSWORD VALIDATION =================

        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,20}$/;


        if (!passwordRegex.test(formData.password)) {

            setError(
                "Password must be 8-20 characters and contain at least one uppercase letter, one lowercase letter, one digit, and one special character."
            );

            return;
        }


        try {

            setLoading(true);


            // ================= LOGIN API =================

            const response = await loginUser({
                email: formData.email,
                password: formData.password
            });


            console.log(
                "Login Response:",
                response.data
            );


            // ================= GET TOKEN =================

            const token = response.data.token;


            if (!token) {

                setError(
                    "Login failed. JWT token was not received."
                );

                return;
            }


            // ================= AUTH CONTEXT =================

            const userData = login(token);


            console.log(
                "Logged-in User:",
                userData
            );


            if (!userData) {

                setError(
                    "Unable to process authentication token."
                );

                return;
            }


            // ================= SUCCESS =================

            alert(
                response.data.message ||
                "Login successful!"
            );


            // ================= ROLE BASED NAVIGATION =================

            if (userData.role === "WORKER") {

                navigate("/worker/dashboard");

            }
            else if (userData.role === "EMPLOYER") {

                navigate("/employer/dashboard");

            }
            else {

                navigate("/");

            }


        }
        catch (error) {

            console.error(
                "Login Error:",
                error
            );


            // ================= BACKEND ERROR =================

            if (error.response) {

                console.error(
                    "Backend Error:",
                    error.response.data
                );


                setError(
                    error.response.data?.message ||
                    "Invalid email or password."
                );

            }
            else {

                setError(
                    "Unable to connect to the server. Please make sure the backend is running."
                );
            }

        }
        finally {

            setLoading(false);
        }

    };


    return (
        <>
            {/* ================= NAVBAR ================= */}

            <Navbar />


            {/* ================= LOGIN CONTAINER ================= */}

            <div className="container">

                <div
                    className="row justify-content-center align-items-center"
                    style={{ minHeight: "85vh" }}
                >

                    <div className="col-md-6 col-lg-5">

                        <div className="card shadow border-0">

                            <div className="card-body p-5">


                                {/* ================= TITLE ================= */}

                                <div className="text-center mb-4">

                                    <h2 className="fw-bold">
                                        Welcome Back
                                    </h2>

                                    <p className="text-muted">
                                        Login to your WorkConnect account
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


                                {/* ================= FORM ================= */}

                                <form onSubmit={handleSubmit}>


                                    {/* ================= EMAIL ================= */}

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
                                            placeholder="Enter your email"
                                            value={
                                                formData.email
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>


                                    {/* ================= PASSWORD ================= */}

                                    <div className="mb-2">

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
                                            placeholder="Enter your password"
                                            value={
                                                formData.password
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            required
                                        />

                                    </div>


                                    {/* PASSWORD REQUIREMENT */}

                                    <div className="mb-4">

                                        <small className="text-muted">

                                            Password must contain
                                            uppercase, lowercase,
                                            number and special
                                            character (8-20 characters).

                                        </small>

                                    </div>


                                    {/* ================= LOGIN BUTTON ================= */}

                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 py-2"
                                        disabled={loading}
                                    >

                                        {loading
                                            ? "Logging in..."
                                            : "Login"
                                        }

                                    </button>

                                </form>


                                {/* ================= REGISTER ================= */}

                                <div className="text-center mt-4">

                                    <p className="mb-0 text-muted">

                                        Don't have an account?{" "}

                                        <Link
                                            to="/register"
                                            className="text-decoration-none fw-semibold"
                                        >
                                            Create an account
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

export default Login;