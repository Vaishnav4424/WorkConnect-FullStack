import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const navClass = ({ isActive }) => `nav-link${isActive ? " active" : ""}`;

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark site-navbar sticky-top">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">
                    Work<span>Connect</span>
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#workconnectNavbar"
                    aria-controls="workconnectNavbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="workconnectNavbar">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink className={navClass} to="/" end>Home</NavLink>
                        </li>

                        {isAuthenticated && user.role === "WORKER" && (
                            <>
                                <li className="nav-item"><NavLink className={navClass} to="/worker/dashboard">Dashboard</NavLink></li>
                                <li className="nav-item"><NavLink className={navClass} to="/worker/jobs">Find Jobs</NavLink></li>
                                <li className="nav-item"><NavLink className={navClass} to="/worker/applications">Applications</NavLink></li>
                                <li className="nav-item"><NavLink className={navClass} to="/worker/contracts">Contracts</NavLink></li>
                                <li className="nav-item"><NavLink className={navClass} to="/worker/profile">Profile</NavLink></li>
                            </>
                        )}

                        {isAuthenticated && user.role === "EMPLOYER" && (
                            <>
                                <li className="nav-item"><NavLink className={navClass} to="/employer/dashboard">Dashboard</NavLink></li>
                                <li className="nav-item"><NavLink className={navClass} to="/employer/jobs">My Jobs</NavLink></li>
                                <li className="nav-item"><NavLink className={navClass} to="/employer/jobs/create">Post Job</NavLink></li>
                                <li className="nav-item"><NavLink className={navClass} to="/employer/contracts">Contracts</NavLink></li>
                                <li className="nav-item"><NavLink className={navClass} to="/employer/payments">Payments</NavLink></li>
                                <li className="nav-item"><NavLink className={navClass} to="/employer/profile">Profile</NavLink></li>
                            </>
                        )}
                    </ul>

                    <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-2">
                        {!isAuthenticated ? (
                            <>
                                <Link to="/login" className="btn btn-outline-light">Login</Link>
                                <Link to="/register" className="btn btn-primary">Register</Link>
                            </>
                        ) : (
                            <>
                                <span className="navbar-text text-white me-lg-2">
                                    Hi, {user.firstName}
                                </span>
                                <button onClick={handleLogout} className="btn btn-outline-light">
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
