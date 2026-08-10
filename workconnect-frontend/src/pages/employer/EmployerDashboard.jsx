import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";
import { getApiErrorMessage } from "../../services/api";
import { getEmployerContracts } from "../../services/contractService";
import { getEmployerJobs } from "../../services/employerService";

function EmployerDashboard() {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [profileMissing, setProfileMissing] = useState(false);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                const [jobResponse, contractResponse] = await Promise.all([
                    getEmployerJobs(user.userId),
                    getEmployerContracts(user.userId)
                ]);
                setJobs(jobResponse.data);
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
        ["Total Jobs", jobs.length],
        ["Open Jobs", jobs.filter((item) => item.status === "OPEN").length],
        ["Active Contracts", contracts.filter((item) => item.contractStatus === "ACTIVE").length],
        ["In Progress", contracts.filter((item) => item.contractStatus === "IN_PROGRESS").length],
        ["Completed", contracts.filter((item) => item.contractStatus === "COMPLETED").length]
    ];

    return (
        <div className="container py-4 py-md-5">
            <div className="page-header d-md-flex justify-content-between align-items-end">
                <div>
                    <span className="eyebrow">Employer dashboard</span>
                    <h1 className="h2 fw-bold mt-2">Welcome, {user.firstName}</h1>
                    <p className="text-secondary mb-0">Track jobs and contracts using live project data.</p>
                </div>
                <Link to="/employer/jobs/create" className="btn btn-primary mt-3 mt-md-0">Post New Job</Link>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {profileMissing && (
                <div className="alert alert-info d-md-flex justify-content-between align-items-center">
                    <span>Please complete your employer profile first.</span>
                    <Link to="/employer/profile" className="btn btn-sm btn-primary mt-2 mt-md-0">Complete Profile</Link>
                </div>
            )}

            <div className="row g-3 mb-4">
                {stats.map(([label, value]) => (
                    <div className="col-6 col-lg" key={label}>
                        <div className="card stat-card h-100"><div className="card-body"><div className="stat-value">{value}</div><div className="text-secondary small">{label}</div></div></div>
                    </div>
                ))}
            </div>

            <div className="row g-4">
                <div className="col-md-3"><Link className="card content-card h-100 text-decoration-none text-dark" to="/employer/jobs/create"><div className="card-body p-4"><h2 className="h5 fw-bold">Post New Job</h2><p className="text-secondary mb-0">Create a new opportunity.</p></div></Link></div>
                <div className="col-md-3"><Link className="card content-card h-100 text-decoration-none text-dark" to="/employer/jobs"><div className="card-body p-4"><h2 className="h5 fw-bold">Manage Jobs</h2><p className="text-secondary mb-0">Edit jobs and review applicants.</p></div></Link></div>
                <div className="col-md-3"><Link className="card content-card h-100 text-decoration-none text-dark" to="/employer/contracts"><div className="card-body p-4"><h2 className="h5 fw-bold">View Contracts</h2><p className="text-secondary mb-0">Manage status and payments.</p></div></Link></div>
                <div className="col-md-3"><Link className="card content-card h-100 text-decoration-none text-dark" to="/employer/profile"><div className="card-body p-4"><h2 className="h5 fw-bold">Edit Profile</h2><p className="text-secondary mb-0">Keep organization details current.</p></div></Link></div>
            </div>
        </div>
    );
}

export default EmployerDashboard;
