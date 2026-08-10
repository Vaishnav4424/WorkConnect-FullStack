import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import StatusBadge from "../../components/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { applyForJob } from "../../services/applicationService";
import { getApiErrorMessage } from "../../services/api";
import { getJobById } from "../../services/jobService";
import { searchJobs } from "../../services/workerService";

const categories = ["PLUMBING", "ELECTRICIAN", "CLEANING", "PAINTING", "CARPENTRY", "DELIVERY", "OTHER"];
const initialFilters = {
    keyword: "",
    location: "",
    category: "",
    minBudget: "",
    maxBudget: "",
    sortBy: "postedDate",
    direction: "DESC",
    size: 10
};

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });
const displayDate = (value) => value ? new Date(`${value}T00:00:00`).toLocaleDateString("en-IN") : "Not provided";

function SearchJobs() {
    const { user } = useAuth();
    const [filters, setFilters] = useState(initialFilters);
    const [submittedFilters, setSubmittedFilters] = useState(initialFilters);
    const [jobs, setJobs] = useState([]);
    const [pageInfo, setPageInfo] = useState({ number: 0, totalPages: 0, totalElements: 0, first: true, last: true });
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [selectedJob, setSelectedJob] = useState(null);
    const [applyJob, setApplyJob] = useState(null);
    const [proposal, setProposal] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const loadJobs = async () => {
            try {
                setLoading(true);
                setError("");
                const params = { ...submittedFilters, page };
                Object.keys(params).forEach((key) => {
                    if (params[key] === "") delete params[key];
                });
                const response = await searchJobs(params);
                setJobs(response.data.content || []);
                setPageInfo({
                    number: response.data.number,
                    totalPages: response.data.totalPages,
                    totalElements: response.data.totalElements,
                    first: response.data.first,
                    last: response.data.last
                });
            } catch (requestError) {
                setError(getApiErrorMessage(requestError, "Unable to search jobs."));
            } finally {
                setLoading(false);
            }
        };

        loadJobs();
    }, [page, submittedFilters]);

    const handleFilterChange = (event) => {
        setFilters({ ...filters, [event.target.name]: event.target.value });
    };

    const handleSearch = (event) => {
        event.preventDefault();
        if (filters.minBudget && filters.maxBudget && Number(filters.minBudget) > Number(filters.maxBudget)) {
            setError("Minimum budget cannot be greater than maximum budget.");
            return;
        }
        setError("");
        setPage(0);
        setSubmittedFilters({ ...filters });
    };

    const handleReset = () => {
        setFilters(initialFilters);
        setSubmittedFilters(initialFilters);
        setPage(0);
    };

    const handleViewDetails = async (jobId) => {
        try {
            setActionLoading(true);
            setError("");
            const response = await getJobById(jobId);
            setSelectedJob(response.data);
        } catch (requestError) {
            setError(getApiErrorMessage(requestError, "Unable to load job details."));
        } finally {
            setActionLoading(false);
        }
    };

    const handleApply = async (event) => {
        event.preventDefault();
        if (!proposal.trim()) {
            setError("Proposal is required before applying.");
            return;
        }

        try {
            setActionLoading(true);
            setError("");
            const response = await applyForJob(user.userId, applyJob.jobPostId, { proposal: proposal.trim() });
            setSuccess(response.data.message || "Application submitted successfully.");
            setApplyJob(null);
            setProposal("");
        } catch (requestError) {
            setError(getApiErrorMessage(requestError, "Unable to apply for this job."));
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="container py-4 py-md-5">
            <div className="page-header">
                <span className="eyebrow">Worker opportunities</span>
                <h1 className="h2 fw-bold mt-2">Find Jobs</h1>
                <p className="text-secondary mb-0">Filter open opportunities and apply with a proposal.</p>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form className="card content-card mb-4" onSubmit={handleSearch}>
                <div className="card-body p-4">
                    <div className="row g-3">
                        <div className="col-md-4"><label className="form-label" htmlFor="keyword">Keyword</label><input id="keyword" name="keyword" className="form-control" value={filters.keyword} onChange={handleFilterChange} /></div>
                        <div className="col-md-4"><label className="form-label" htmlFor="location">Location</label><input id="location" name="location" className="form-control" value={filters.location} onChange={handleFilterChange} /></div>
                        <div className="col-md-4"><label className="form-label" htmlFor="category">Category</label><select id="category" name="category" className="form-select" value={filters.category} onChange={handleFilterChange}><option value="">All Categories</option>{categories.map((category) => <option key={category} value={category}>{category.replaceAll("_", " ")}</option>)}</select></div>
                        <div className="col-md-3"><label className="form-label" htmlFor="minBudget">Minimum budget</label><input id="minBudget" name="minBudget" type="number" min="0" className="form-control" value={filters.minBudget} onChange={handleFilterChange} /></div>
                        <div className="col-md-3"><label className="form-label" htmlFor="maxBudget">Maximum budget</label><input id="maxBudget" name="maxBudget" type="number" min="0" className="form-control" value={filters.maxBudget} onChange={handleFilterChange} /></div>
                        <div className="col-md-3"><label className="form-label" htmlFor="sortBy">Sort by</label><select id="sortBy" name="sortBy" className="form-select" value={filters.sortBy} onChange={handleFilterChange}><option value="postedDate">Posted Date</option><option value="budget">Budget</option><option value="deadline">Deadline</option><option value="jobTitle">Job Title</option></select></div>
                        <div className="col-md-3"><label className="form-label" htmlFor="direction">Direction</label><select id="direction" name="direction" className="form-select" value={filters.direction} onChange={handleFilterChange}><option value="DESC">Descending</option><option value="ASC">Ascending</option></select></div>
                    </div>
                    <div className="d-flex gap-2 mt-4"><button className="btn btn-primary">Search</button><button type="button" className="btn btn-outline-secondary" onClick={handleReset}>Reset</button></div>
                </div>
            </form>

            {loading ? <Loader text="Searching jobs..." /> : (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="h5 mb-0">Available jobs</h2>
                        <span className="text-secondary small">{pageInfo.totalElements} result(s)</span>
                    </div>
                    {jobs.length === 0 ? <div className="card content-card empty-state">No jobs found. Try changing your filters.</div> : (
                        <div className="row g-4">
                            {jobs.map((job) => (
                                <div className="col-lg-6" key={job.jobPostId}>
                                    <div className="card content-card job-card h-100"><div className="card-body p-4">
                                        <div className="d-flex justify-content-between gap-3"><div><h3 className="h5 fw-bold mb-1">{job.jobTitle}</h3><p className="text-secondary mb-2">{job.employerName}</p></div><StatusBadge status={job.status} /></div>
                                        <p className="text-secondary">{job.jobDescription || "No description provided."}</p>
                                        <div className="row small g-2 mb-3"><div className="col-6"><strong>Category:</strong> {job.category}</div><div className="col-6"><strong>Location:</strong> {job.location}</div><div className="col-6"><strong>Budget:</strong> {money.format(job.budget || 0)}</div><div className="col-6"><strong>Deadline:</strong> {displayDate(job.deadline)}</div><div className="col-12"><strong>Posted:</strong> {displayDate(job.postedDate)}</div></div>
                                        <div className="d-flex gap-2"><button className="btn btn-outline-primary" onClick={() => handleViewDetails(job.jobPostId)} disabled={actionLoading}>View Details</button><button className="btn btn-primary" disabled={job.status !== "OPEN"} onClick={() => { setApplyJob(job); setProposal(""); setError(""); }}>Apply</button></div>
                                    </div></div>
                                </div>
                            ))}
                        </div>
                    )}
                    {pageInfo.totalPages > 1 && <div className="d-flex justify-content-center align-items-center gap-3 mt-4"><button className="btn btn-outline-primary" disabled={pageInfo.first} onClick={() => setPage((current) => current - 1)}>Previous</button><span>Page {pageInfo.number + 1} of {pageInfo.totalPages}</span><button className="btn btn-outline-primary" disabled={pageInfo.last} onClick={() => setPage((current) => current + 1)}>Next</button></div>}
                </>
            )}

            {selectedJob && <div className="modal-backdrop-custom" role="dialog" aria-modal="true"><div className="modal-panel"><div className="p-4 border-bottom d-flex justify-content-between"><h2 className="h4 mb-0">{selectedJob.jobTitle}</h2><button className="btn-close" onClick={() => setSelectedJob(null)} /></div><div className="p-4"><StatusBadge status={selectedJob.status} /><p className="mt-3">{selectedJob.jobDescription || "No description provided."}</p><dl className="row mb-0"><dt className="col-sm-4">Employer</dt><dd className="col-sm-8">{selectedJob.employerName}</dd><dt className="col-sm-4">Category</dt><dd className="col-sm-8">{selectedJob.category}</dd><dt className="col-sm-4">Location</dt><dd className="col-sm-8">{selectedJob.location}</dd><dt className="col-sm-4">Budget</dt><dd className="col-sm-8">{money.format(selectedJob.budget || 0)}</dd><dt className="col-sm-4">Deadline</dt><dd className="col-sm-8">{displayDate(selectedJob.deadline)}</dd></dl></div><div className="p-4 border-top text-end"><button className="btn btn-secondary" onClick={() => setSelectedJob(null)}>Close</button></div></div></div>}

            {applyJob && <div className="modal-backdrop-custom" role="dialog" aria-modal="true"><div className="modal-panel"><form onSubmit={handleApply}><div className="p-4 border-bottom"><h2 className="h4 mb-1">Apply for {applyJob.jobTitle}</h2><p className="text-secondary mb-0">Tell the employer why you are a good fit.</p></div><div className="p-4"><label htmlFor="proposal" className="form-label">Proposal</label><textarea id="proposal" className="form-control" rows="6" value={proposal} onChange={(event) => setProposal(event.target.value)} /></div><div className="p-4 border-top d-flex justify-content-end gap-2"><button type="button" className="btn btn-outline-secondary" onClick={() => setApplyJob(null)}>Cancel</button><button className="btn btn-primary" disabled={actionLoading}>{actionLoading ? "Submitting..." : "Submit Application"}</button></div></form></div></div>}
        </div>
    );
}

export default SearchJobs;
