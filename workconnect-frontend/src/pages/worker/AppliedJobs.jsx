import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import StatusBadge from "../../components/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { getWorkerApplications, withdrawApplication } from "../../services/applicationService";
import { getApiErrorMessage } from "../../services/api";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });
const displayDate = (value) => value ? new Date(`${value}T00:00:00`).toLocaleDateString("en-IN") : "-";

function AppliedJobs() {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [filter, setFilter] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response = await getWorkerApplications(user.userId);
            setApplications(response.data);
        } catch (requestError) {
            setError(getApiErrorMessage(requestError, "Unable to load applications."));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadInitialApplications = async () => {
            try {
                const response = await getWorkerApplications(user.userId);
                setApplications(response.data);
            } catch (requestError) {
                setError(getApiErrorMessage(requestError, "Unable to load applications."));
            } finally {
                setLoading(false);
            }
        };

        loadInitialApplications();
    }, [user.userId]);

    const handleWithdraw = async (application) => {
        if (!window.confirm(`Withdraw your application for ${application.jobTitle}?`)) return;

        try {
            setError("");
            const response = await withdrawApplication(application.applicationId);
            setSuccess(response.data.message || "Application withdrawn successfully.");
            await fetchApplications();
        } catch (requestError) {
            setError(getApiErrorMessage(requestError, "Unable to withdraw application."));
        }
    };

    const visibleApplications = filter === "ALL"
        ? applications
        : applications.filter((item) => item.applicationStatus === filter);

    return (
        <div className="container py-4 py-md-5">
            <div className="page-header d-md-flex justify-content-between align-items-end">
                <div><span className="eyebrow">Worker applications</span><h1 className="h2 fw-bold mt-2">Applied Jobs</h1><p className="text-secondary mb-0">Review every application and withdraw when allowed.</p></div>
                <select className="form-select mt-3 mt-md-0" style={{ maxWidth: "220px" }} value={filter} onChange={(event) => setFilter(event.target.value)}><option value="ALL">All Statuses</option>{["PENDING", "ACCEPTED", "REJECTED", "WITHDRAWN"].map((status) => <option key={status}>{status}</option>)}</select>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            {loading ? <Loader text="Loading applications..." /> : visibleApplications.length === 0 ? <div className="card content-card empty-state">You have no applications matching this filter.</div> : (
                <div className="card content-card"><div className="table-responsive"><table className="table mb-0"><thead><tr><th>Job</th><th>Company</th><th>Details</th><th>Applied</th><th>Application</th><th>Action</th></tr></thead><tbody>{visibleApplications.map((application) => <tr key={application.applicationId}><td><strong>{application.jobTitle}</strong><div className="small text-secondary">{application.category}</div></td><td>{application.companyName}</td><td><div>{application.location}</div><div className="small">{money.format(application.budget || 0)} · Due {displayDate(application.deadline)}</div><StatusBadge status={application.jobStatus} /></td><td>{displayDate(application.appliedDate)}</td><td><StatusBadge status={application.applicationStatus} /></td><td>{!["ACCEPTED", "WITHDRAWN"].includes(application.applicationStatus) ? <button className="btn btn-sm btn-outline-danger" onClick={() => handleWithdraw(application)}>Withdraw</button> : <span className="text-secondary small">Not available</span>}</td></tr>)}</tbody></table></div></div>
            )}
        </div>
    );
}

export default AppliedJobs;
