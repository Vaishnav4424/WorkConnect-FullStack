import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {

    const { user, isAuthenticated, logout } = useAuth();

    const navigate = useNavigate();

    const handleLogout = () => {

        logout();

        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

            <div className="container">

                {/* Logo */}
                <Link
                    className="navbar-brand fw-bold"
                    to="/"
                >
                    WorkConnect
                </Link>


                {/* Mobile Toggle */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarContent"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>


                <div
                    className="collapse navbar-collapse"
                    id="navbarContent"
                >

                    {/* Left Menu */}
                    <ul className="navbar-nav me-auto">

                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/"
                            >
                                Home
                            </Link>
                        </li>


                        {/* Worker Menu */}
                        {isAuthenticated &&
                            user.role === "WORKER" && (
                                <>
                                    <li className="nav-item">
                                        <Link
                                            className="nav-link"
                                            to="/worker/jobs"
                                        >
                                            Find Jobs
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link
                                            className="nav-link"
                                            to="/worker/applications"
                                        >
                                            Applications
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link
                                            className="nav-link"
                                            to="/worker/contracts"
                                        >
                                            Contracts
                                        </Link>
                                    </li>
                                </>
                            )}


                        {/* Employer Menu */}
                        {isAuthenticated &&
                            user.role === "EMPLOYER" && (
                                <>
                                    <li className="nav-item">
                                        <Link
                                            className="nav-link"
                                            to="/employer/jobs"
                                        >
                                            My Jobs
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link
                                            className="nav-link"
                                            to="/employer/jobs/create"
                                        >
                                            Post Job
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link
                                            className="nav-link"
                                            to="/employer/contracts"
                                        >
                                            Contracts
                                        </Link>
                                    </li>
                                </>
                            )}

                    </ul>


                    {/* Right Menu */}
                    <div className="d-flex align-items-center gap-2">

                        {!isAuthenticated ? (
                            <>
                                <Link
                                    to="/login"
                                    className="btn btn-outline-light"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    className="btn btn-primary"
                                >
                                    Register
                                </Link>
                            </>
                        ) : (
                            <>
                                <span className="text-white me-2">
                                    Hi, {user.firstName}
                                </span>

                                <button
                                    onClick={handleLogout}
                                    className="btn btn-outline-light"
                                >
                                    Logout
                                </button>
                            </>
                        )}

                    </div>

                </div>

            </div>

        </nav>
    );
}

export default Navbar;
