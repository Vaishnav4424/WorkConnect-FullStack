import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
    const { user, isAuthenticated } = useAuth();
    const dashboardPath = user?.role === "EMPLOYER"
        ? "/employer/dashboard"
        : "/worker/dashboard";

    return (
        <>
            <section className="hero-section">
                <div className="container py-5">
                    <div className="row align-items-center py-lg-5 g-5">
                        <div className="col-lg-7">
                            <span className="eyebrow">Local skills. Real opportunities.</span>
                            <h1 className="display-3 fw-bold mt-3 mb-4">
                                Find the right work.<br />Find the right talent.
                            </h1>
                            <p className="lead text-secondary mb-4">
                                WorkConnect brings skilled workers and employers together,
                                from the first job post to contracts and payments.
                            </p>
                            <div className="d-flex flex-wrap gap-3">
                                {isAuthenticated ? (
                                    <Link to={dashboardPath} className="btn btn-primary btn-lg">
                                        Open Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link to="/register" className="btn btn-primary btn-lg">
                                            Create an Account
                                        </Link>
                                        <Link to="/login" className="btn btn-outline-dark btn-lg">
                                            Login
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <div className="hero-card shadow-lg">
                                <div className="hero-card-icon">WC</div>
                                <h2 className="h3 fw-bold">One simple workspace</h2>
                                <p className="text-secondary mb-4">
                                    Search and post jobs, manage applications, create
                                    contracts, and follow payment progress.
                                </p>
                                <div className="d-grid gap-3">
                                    <div className="feature-line"><span>1</span> Create your role-based profile</div>
                                    <div className="feature-line"><span>2</span> Connect through real job applications</div>
                                    <div className="feature-line"><span>3</span> Manage work from contract to payment</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-5 bg-white">
                <div className="container py-4">
                    <div className="text-center mb-5">
                        <span className="eyebrow">How it works</span>
                        <h2 className="fw-bold mt-2">A clear path from need to completion</h2>
                    </div>
                    <div className="row g-4">
                        {[
                            ["Create your profile", "Share your skills as a worker or your organization details as an employer."],
                            ["Find the right match", "Search open jobs or review applicants using live backend data."],
                            ["Work with confidence", "Track contracts, statuses, and payment history in one place."]
                        ].map(([title, text], index) => (
                            <div className="col-md-4" key={title}>
                                <div className="card feature-card h-100 border-0 shadow-sm">
                                    <div className="card-body p-4">
                                        <div className="step-number">0{index + 1}</div>
                                        <h3 className="h5 fw-bold mt-4">{title}</h3>
                                        <p className="text-secondary mb-0">{text}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}

export default Home;
