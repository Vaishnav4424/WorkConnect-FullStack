import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";
import { getWorkerApplications } from "../../services/applicationService";
import { getApiErrorMessage } from "../../services/api";
import { getWorkerContracts } from "../../services/contractService";

function WorkerDashboard() {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [profileMissing, setProfileMissing] = useState(false);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                const [applicationResponse, contractResponse] = await Promise.all([
                    getWorkerApplications(user.userId),
                    getWorkerContracts(user.userId)
                ]);
                setApplications(applicationResponse.data);
                setContracts(contractResponse.data);
            } catch (requestError) {
                if (requestError.response?.status === 404) {
                    setProfileMissing(true);
                } else {
                    setError(getApiErrorMessage(requestError, "Unable to load dashboard."));
                }
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, [user.userId]);

    if (loading) return <Loader text="Loading your dashboard..." />;

    const stats = [
        ["Total Applications", applications.length],
        ["Pending Applications", applications.filter((item) => item.applicationStatus === "PENDING").length],
        ["Accepted Applications", applications.filter((item) => item.applicationStatus === "ACCEPTED").length],
        ["Active Contracts", contracts.filter((item) => ["ACTIVE", "IN_PROGRESS"].includes(item.contractStatus)).length],
        ["Completed Contracts", contracts.filter((item) => item.contractStatus === "COMPLETED").length]
    ];

    return (
        <div className="container py-4 py-md-5">
            <div className="page-header d-md-flex justify-content-between align-items-end">
                <div>
                    <span className="eyebrow">Worker dashboard</span>
                    <h1 className="h2 fw-bold mt-2">Welcome, {user.firstName}</h1>
                    <p className="text-secondary mb-0">Your applications and contracts at a glance.</p>
                </div>
                <Link to="/worker/jobs" className="btn btn-primary mt-3 mt-md-0">Find Jobs</Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {profileMissing && (
                <div className="alert alert-info d-md-flex justify-content-between align-items-center">
                    <span>Please complete your worker profile first.</span>
                    <Link to="/worker/profile" className="btn btn-sm btn-primary mt-2 mt-md-0">Complete Profile</Link>
                </div>
            )}

            <div className="row g-3 mb-4">
                {stats.map(([label, value]) => (
                    <div className="col-6 col-lg" key={label}>
                        <div className="card stat-card h-100">
                            <div className="card-body">
                                <div className="stat-value">{value}</div>
                                <div className="text-secondary small">{label}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-4">
                <div className="col-md-4"><Link className="card content-card h-100 text-decoration-none text-dark" to="/worker/jobs"><div className="card-body p-4"><h2 className="h5 fw-bold">Find Jobs</h2><p className="text-secondary mb-0">Search open work by category, location, and budget.</p></div></Link></div>
                <div className="col-md-4"><Link className="card content-card h-100 text-decoration-none text-dark" to="/worker/applications"><div className="card-body p-4"><h2 className="h5 fw-bold">My Applications</h2><p className="text-secondary mb-0">Follow decisions and withdraw when permitted.</p></div></Link></div>
                <div className="col-md-4"><Link className="card content-card h-100 text-decoration-none text-dark" to="/worker/contracts"><div className="card-body p-4"><h2 className="h5 fw-bold">Contracts & Payments</h2><p className="text-secondary mb-0">Review contract details and payment history.</p></div></Link></div>
            </div>
        </div>
    );
}

export default WorkerDashboard;
