import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import StatusBadge from "../../components/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { getApiErrorMessage } from "../../services/api";
import { getEmployerJobs } from "../../services/employerService";
import { deleteJob, getJobById, updateJob } from "../../services/jobService";

const categories = ["PLUMBING", "ELECTRICIAN", "CLEANING", "PAINTING", "CARPENTRY", "DELIVERY", "OTHER"];
const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });
const displayDate = (value) => value ? new Date(`${value}T00:00:00`).toLocaleDateString("en-IN") : "-";

function ManageJobs() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);
    const [editForm, setEditForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchJobs = async () => {
        try {
            const response = await getEmployerJobs(user.userId);
            setJobs(response.data);
        } catch (requestError) {
            setError(getApiErrorMessage(requestError, "Unable to load your jobs."));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadInitialJobs = async () => {
            try {
                const response = await getEmployerJobs(user.userId);
                setJobs(response.data);
            } catch (requestError) {
                setError(getApiErrorMessage(requestError, "Unable to load your jobs."));
            } finally {
                setLoading(false);
            }
        };

        loadInitialJobs();
    }, [user.userId]);

    const loadJob = async (jobId, mode) => {
        try {
            setActionLoading(true);
            setError("");
            const response = await getJobById(jobId);
            if (mode === "edit") {
                const job = response.data;
                setEditForm({
                    jobPostId: job.jobPostId,
                    jobTitle: job.jobTitle || "",
                    jobDescription: job.jobDescription || "",
                    category: job.category,
                    location: job.location || "",
                    budget: job.budget ?? "",
                    deadline: job.deadline || ""
                });
            } else {
                setSelectedJob(response.data);
            }
        } catch (requestError) {
            setError(getApiErrorMessage(requestError, "Unable to load job details."));
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdate = async (event) => {
        event.preventDefault();
        if (!editForm.jobTitle.trim() || !editForm.location.trim() || editForm.budget === "" || !editForm.deadline) {
            setError("Please complete all required job fields.");
            return;
        }
        try {
            setActionLoading(true);
            const response = await updateJob(editForm.jobPostId, {
                jobTitle: editForm.jobTitle.trim(),
                jobDescription: editForm.jobDescription.trim(),
                category: editForm.category,
                location: editForm.location.trim(),
                budget: Number(editForm.budget),
                deadline: editForm.deadline
            });
            setSuccess(response.data.message || "Job updated successfully.");
            setEditForm(null);
            await fetchJobs();
        } catch (requestError) {
            setError(getApiErrorMessage(requestError, "Unable to update job."));
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (job) => {
        if (!window.confirm(`Cancel/Delete the job "${job.jobTitle}"?`)) return;
        try {
            const response = await deleteJob(job.jobPostId);
            setSuccess(response.data.message || "Job cancelled successfully.");
            await fetchJobs();
        } catch (requestError) {
            setError(getApiErrorMessage(requestError, "Unable to cancel job."));
        }
    };

    return (
        <div className="container py-4 py-md-5">
            <div className="page-header d-md-flex justify-content-between align-items-end"><div><span className="eyebrow">Employer jobs</span><h1 className="h2 fw-bold mt-2">Manage Jobs</h1><p className="text-secondary mb-0">View, edit, cancel, and inspect applicants.</p></div><Link to="/employer/jobs/create" className="btn btn-primary mt-3 mt-md-0">Post New Job</Link></div>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            {loading ? <Loader text="Loading your jobs..." /> : jobs.length === 0 ? <div className="card content-card empty-state">No active jobs found. <div><Link to="/employer/jobs/create" className="btn btn-primary mt-3">Post Your First Job</Link></div></div> : (
                <div className="card content-card"><div className="table-responsive"><table className="table mb-0"><thead><tr><th>Job</th><th>Location</th><th>Budget</th><th>Dates</th><th>Status</th><th>Actions</th></tr></thead><tbody>{jobs.map((job) => <tr key={job.jobPostId}><td><strong>{job.jobTitle}</strong><div className="small text-secondary">{job.category}</div></td><td>{job.location}</td><td>{money.format(job.budget || 0)}</td><td><div>Posted {displayDate(job.postedDate)}</div><div className="small text-secondary">Due {displayDate(job.deadline)}</div></td><td><StatusBadge status={job.status} /></td><td><div className="d-flex flex-wrap gap-2"><button className="btn btn-sm btn-outline-primary" disabled={actionLoading} onClick={() => loadJob(job.jobPostId, "view")}>View</button><button className="btn btn-sm btn-outline-secondary" disabled={actionLoading} onClick={() => loadJob(job.jobPostId, "edit")}>Edit</button><button className="btn btn-sm btn-primary" onClick={() => navigate(`/employer/jobs/${job.jobPostId}/applicants`)}>Applicants</button><button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(job)}>Cancel/Delete</button></div></td></tr>)}</tbody></table></div></div>
            )}

            {selectedJob && <div className="modal-backdrop-custom"><div className="modal-panel"><div className="p-4 border-bottom d-flex justify-content-between"><h2 className="h4 mb-0">{selectedJob.jobTitle}</h2><button className="btn-close" onClick={() => setSelectedJob(null)} /></div><div className="p-4"><StatusBadge status={selectedJob.status} /><p className="mt-3">{selectedJob.jobDescription || "No description provided."}</p><dl className="row mb-0"><dt className="col-4">Category</dt><dd className="col-8">{selectedJob.category}</dd><dt className="col-4">Location</dt><dd className="col-8">{selectedJob.location}</dd><dt className="col-4">Budget</dt><dd className="col-8">{money.format(selectedJob.budget || 0)}</dd><dt className="col-4">Deadline</dt><dd className="col-8">{displayDate(selectedJob.deadline)}</dd></dl></div></div></div>}

            {editForm && <div className="modal-backdrop-custom"><div className="modal-panel modal-lg-custom"><form onSubmit={handleUpdate}><div className="p-4 border-bottom d-flex justify-content-between"><h2 className="h4 mb-0">Edit Job</h2><button type="button" className="btn-close" onClick={() => setEditForm(null)} /></div><div className="p-4"><div className="row g-3"><div className="col-md-8"><label className="form-label">Job title</label><input className="form-control" maxLength="50" value={editForm.jobTitle} onChange={(event) => setEditForm({ ...editForm, jobTitle: event.target.value })} /></div><div className="col-md-4"><label className="form-label">Category</label><select className="form-select" value={editForm.category} onChange={(event) => setEditForm({ ...editForm, category: event.target.value })}>{categories.map((category) => <option key={category}>{category}</option>)}</select></div><div className="col-12"><label className="form-label">Description</label><textarea className="form-control" rows="4" value={editForm.jobDescription} onChange={(event) => setEditForm({ ...editForm, jobDescription: event.target.value })} /></div><div className="col-md-6"><label className="form-label">Location</label><input className="form-control" value={editForm.location} onChange={(event) => setEditForm({ ...editForm, location: event.target.value })} /></div><div className="col-md-3"><label className="form-label">Budget</label><input type="number" min="0" className="form-control" value={editForm.budget} onChange={(event) => setEditForm({ ...editForm, budget: event.target.value })} /></div><div className="col-md-3"><label className="form-label">Deadline</label><input type="date" className="form-control" value={editForm.deadline} onChange={(event) => setEditForm({ ...editForm, deadline: event.target.value })} /></div></div></div><div className="p-4 border-top text-end"><button className="btn btn-primary" disabled={actionLoading}>{actionLoading ? "Saving..." : "Save Changes"}</button></div></form></div></div>}
        </div>
    );
}

export default ManageJobs;
