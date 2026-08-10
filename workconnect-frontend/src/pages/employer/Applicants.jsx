import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import StatusBadge from "../../components/StatusBadge";
import { getJobApplicants, updateApplicationStatus } from "../../services/applicationService";
import { getApiErrorMessage } from "../../services/api";
import { createContract } from "../../services/contractService";
import { getJobById } from "../../services/jobService";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });
const displayDate = (value) => value ? new Date(`${value}T00:00:00`).toLocaleDateString("en-IN") : "-";
const today = new Date().toISOString().split("T")[0];

function Applicants() {
    const { jobId } = useParams();
    const [job, setJob] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [contractApplicant, setContractApplicant] = useState(null);
    const [contractForm, setContractForm] = useState({ startDate: "", endDate: "", agreedAmount: "" });
    const [contracted, setContracted] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchPage = async () => {
        try {
            const [jobResponse, applicantsResponse] = await Promise.all([
                getJobById(jobId),
                getJobApplicants(jobId)
            ]);
            setJob(jobResponse.data);
            setApplicants(applicantsResponse.data);
        } catch (requestError) {
            setError(getApiErrorMessage(requestError, "Unable to load applicants."));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadInitialPage = async () => {
            try {
                const [jobResponse, applicantsResponse] = await Promise.all([
                    getJobById(jobId),
                    getJobApplicants(jobId)
                ]);
                setJob(jobResponse.data);
                setApplicants(applicantsResponse.data);
            } catch (requestError) {
                setError(getApiErrorMessage(requestError, "Unable to load applicants."));
            } finally {
                setLoading(false);
            }
        };

        loadInitialPage();
    }, [jobId]);

    const handleStatus = async (applicant, status) => {
        if (!window.confirm(`${status === "ACCEPTED" ? "Accept" : "Reject"} ${applicant.workerName}'s application?`)) return;
        try {
            setActionLoading(true);
            setError("");
            const response = await updateApplicationStatus(applicant.applicationId, status);
            setSuccess(response.data.message || `Application ${status.toLowerCase()}.`);
            await fetchPage();
        } catch (requestError) {
            setError(getApiErrorMessage(requestError, "Unable to update application status."));
        } finally {
            setActionLoading(false);
        }
    };

    const openContract = (applicant) => {
        setContractApplicant(applicant);
        setContractForm({ startDate: "", endDate: "", agreedAmount: job?.budget || "" });
    };

    const handleCreateContract = async (event) => {
        event.preventDefault();
        if (!contractForm.startDate || !contractForm.endDate || Number(contractForm.agreedAmount) <= 0) {
            setError("Start date, end date, and an amount greater than zero are required.");
            return;
        }
        if (contractForm.startDate < today || contractForm.endDate <= contractForm.startDate) {
            setError("Start date must be today or later, and end date must be after the start date.");
            return;
        }
        try {
            setActionLoading(true);
            const response = await createContract({
                applicationId: contractApplicant.applicationId,
                startDate: contractForm.startDate,
                endDate: contractForm.endDate,
                agreedAmount: Number(contractForm.agreedAmount)
            });
            setContracted([...contracted, contractApplicant.applicationId]);
            setSuccess(response.data.message || "Contract created successfully.");
            setContractApplicant(null);
        } catch (requestError) {
            setError(getApiErrorMessage(requestError, "Unable to create contract."));
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return <Loader text="Loading applicants..." />;

    return (
        <div className="container py-4 py-md-5">
            <div className="page-header d-md-flex justify-content-between align-items-end"><div><span className="eyebrow">Job applicants</span><h1 className="h2 fw-bold mt-2">{job?.jobTitle || "Applicants"}</h1><p className="text-secondary mb-0">{job ? `${job.location} · ${money.format(job.budget || 0)} · Due ${displayDate(job.deadline)}` : "Review applicants"}</p></div><Link to="/employer/jobs" className="btn btn-outline-primary mt-3 mt-md-0">Back to Jobs</Link></div>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            {applicants.length === 0 ? <div className="card content-card empty-state">No applicants for this job yet.</div> : <div className="card content-card"><div className="table-responsive"><table className="table mb-0"><thead><tr><th>Worker</th><th>Experience & Skills</th><th>Rate</th><th>Applied</th><th>Status</th><th>Actions</th></tr></thead><tbody>{applicants.map((applicant) => <tr key={applicant.applicationId}><td><strong>{applicant.workerName}</strong><div className="small text-secondary">{applicant.email}</div></td><td><div>{applicant.experienceYears} year(s)</div><div className="small text-secondary">{applicant.skillDescription}</div></td><td>{money.format(applicant.hourlyRate || 0)}/hr</td><td>{displayDate(applicant.appliedDate)}</td><td><StatusBadge status={applicant.applicationStatus} /></td><td><div className="d-flex flex-wrap gap-2">{applicant.applicationStatus === "PENDING" && <><button className="btn btn-sm btn-success" disabled={actionLoading} onClick={() => handleStatus(applicant, "ACCEPTED")}>Accept</button><button className="btn btn-sm btn-outline-danger" disabled={actionLoading} onClick={() => handleStatus(applicant, "REJECTED")}>Reject</button></>}{applicant.applicationStatus === "ACCEPTED" && <button className="btn btn-sm btn-primary" disabled={contracted.includes(applicant.applicationId)} onClick={() => openContract(applicant)}>{contracted.includes(applicant.applicationId) ? "Contract Created" : "Create Contract"}</button>}{["REJECTED", "WITHDRAWN"].includes(applicant.applicationStatus) && <span className="small text-secondary">No actions</span>}</div></td></tr>)}</tbody></table></div></div>}

            {contractApplicant && <div className="modal-backdrop-custom"><div className="modal-panel"><form onSubmit={handleCreateContract}><div className="p-4 border-bottom"><h2 className="h4 mb-1">Create Contract</h2><p className="text-secondary mb-0">Accepted worker: {contractApplicant.workerName}</p></div><div className="p-4"><div className="row g-3"><div className="col-md-6"><label className="form-label">Start date</label><input type="date" min={today} className="form-control" value={contractForm.startDate} onChange={(event) => setContractForm({ ...contractForm, startDate: event.target.value })} /></div><div className="col-md-6"><label className="form-label">End date</label><input type="date" min={contractForm.startDate || today} className="form-control" value={contractForm.endDate} onChange={(event) => setContractForm({ ...contractForm, endDate: event.target.value })} /></div><div className="col-12"><label className="form-label">Agreed amount (₹)</label><input type="number" min="0.01" step="0.01" className="form-control" value={contractForm.agreedAmount} onChange={(event) => setContractForm({ ...contractForm, agreedAmount: event.target.value })} /></div></div></div><div className="p-4 border-top d-flex justify-content-end gap-2"><button type="button" className="btn btn-outline-secondary" onClick={() => setContractApplicant(null)}>Cancel</button><button className="btn btn-primary" disabled={actionLoading}>{actionLoading ? "Creating..." : "Create Contract"}</button></div></form></div></div>}
        </div>
    );
}

export default Applicants;
