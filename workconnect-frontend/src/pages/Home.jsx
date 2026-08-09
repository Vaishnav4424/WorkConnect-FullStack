import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
    return (
        <>
            <Navbar />

            {/* ================= HERO SECTION ================= */}
            <section className="bg-light py-5">
                <div className="container py-5">

                    <div className="row align-items-center">

                        {/* Left Content */}
                        <div className="col-lg-7">

                            <h1 className="display-4 fw-bold mb-3">
                                Find the Right Work.
                                <br />
                                Find the Right Talent.
                            </h1>

                            <p className="lead text-muted mb-4">
                                WorkConnect is a job and freelancing
                                marketplace that connects skilled workers
                                with employers looking for the right talent.
                            </p>

                            <div className="d-flex gap-3">

                                <Link
                                    to="/worker/jobs"
                                    className="btn btn-primary btn-lg"
                                >
                                    Find Jobs
                                </Link>

                                <Link
                                    to="/register"
                                    className="btn btn-outline-dark btn-lg"
                                >
                                    Post a Job
                                </Link>

                            </div>

                        </div>

                        {/* Right Content */}
                        <div className="col-lg-5 text-center mt-5 mt-lg-0">

                            <div className="bg-white rounded shadow p-5">

                                <h2 className="fw-bold mb-3">
                                    WorkConnect
                                </h2>

                                <p className="text-muted">
                                    Connect. Work. Grow.
                                </p>

                                <div className="row mt-4">

                                    <div className="col-4">
                                        <h4 className="fw-bold">100+</h4>
                                        <small className="text-muted">
                                            Jobs
                                        </small>
                                    </div>

                                    <div className="col-4">
                                        <h4 className="fw-bold">50+</h4>
                                        <small className="text-muted">
                                            Workers
                                        </small>
                                    </div>

                                    <div className="col-4">
                                        <h4 className="fw-bold">25+</h4>
                                        <small className="text-muted">
                                            Employers
                                        </small>
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            </section>


            {/* ================= HOW IT WORKS ================= */}
            <section className="py-5">

                <div className="container">

                    <div className="text-center mb-5">

                        <h2 className="fw-bold">
                            How WorkConnect Works
                        </h2>

                        <p className="text-muted">
                            A simple way to connect workers and employers.
                        </p>

                    </div>


                    <div className="row g-4">

                        {/* Step 1 */}
                        <div className="col-md-4">

                            <div className="card h-100 border-0 shadow-sm">

                                <div className="card-body text-center p-4">

                                    <div className="display-5 mb-3">
                                        👤
                                    </div>

                                    <h4 className="fw-bold">
                                        Create Profile
                                    </h4>

                                    <p className="text-muted">
                                        Create your profile and showcase
                                        your skills, experience and expertise.
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* Step 2 */}
                        <div className="col-md-4">

                            <div className="card h-100 border-0 shadow-sm">

                                <div className="card-body text-center p-4">

                                    <div className="display-5 mb-3">
                                        🔍
                                    </div>

                                    <h4 className="fw-bold">
                                        Find Opportunities
                                    </h4>

                                    <p className="text-muted">
                                        Search for jobs based on your skills,
                                        location, category and budget.
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* Step 3 */}
                        <div className="col-md-4">

                            <div className="card h-100 border-0 shadow-sm">

                                <div className="card-body text-center p-4">

                                    <div className="display-5 mb-3">
                                        🤝
                                    </div>

                                    <h4 className="fw-bold">
                                        Start Working
                                    </h4>

                                    <p className="text-muted">
                                        Connect with employers, get hired
                                        and manage your contracts.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* ================= CTA SECTION ================= */}
            <section className="bg-dark text-white py-5">

                <div className="container text-center">

                    <h2 className="fw-bold mb-3">
                        Ready to Get Started?
                    </h2>

                    <p className="mb-4">
                        Join WorkConnect and find your next opportunity.
                    </p>

                    <Link
                        to="/register"
                        className="btn btn-primary btn-lg"
                    >
                        Create Your Account
                    </Link>

                </div>

            </section>


            {/* ================= FOOTER ================= */}
            <footer className="bg-black text-white py-4">

                <div className="container text-center">

                    <p className="mb-0">
                        © 2026 WorkConnect. All Rights Reserved.
                    </p>

                </div>

            </footer>

        </>
    );
}

export default Home;
