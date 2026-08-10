import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getApiErrorMessage } from "../../services/api";
import { createJob } from "../../services/employerService";

const categories = ["PLUMBING", "ELECTRICIAN", "CLEANING", "PAINTING", "CARPENTRY", "DELIVERY", "OTHER"];
const initialForm = { jobTitle: "", jobDescription: "", category: "PLUMBING", location: "", budget: "", deadline: "" };
const today = new Date().toISOString().split("T")[0];

function CreateJob() {
    const { user } = useAuth();
    const [formData, setFormData] = useState(initialForm);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!formData.jobTitle.trim() || !formData.location.trim() || !formData.deadline) {
            setError("Job title, location, category, budget, and deadline are required.");
            return;
        }
        if (formData.jobTitle.trim().length > 50) {
            setError("Job title cannot exceed 50 characters.");
            return;
        }
        if (formData.budget === "" || Number(formData.budget) < 0) {
            setError("Budget must be zero or greater.");
            return;
        }
        if (formData.deadline < today) {
            setError("Deadline cannot be in the past.");
            return;
        }

        try {
            setLoading(true);
            const response = await createJob(user.userId, {
                jobTitle: formData.jobTitle.trim(),
                jobDescription: formData.jobDescription.trim(),
                category: formData.category,
                location: formData.location.trim(),
                budget: Number(formData.budget),
                deadline: formData.deadline
            });
            setSuccess(response.data.message || "Job posted successfully.");
            setFormData(initialForm);
        } catch (requestError) {
            setError(getApiErrorMessage(requestError, "Unable to create job."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4 py-md-5">
            <div className="page-header d-md-flex justify-content-between align-items-end">
                <div><span className="eyebrow">Employer jobs</span><h1 className="h2 fw-bold mt-2">Post a New Job</h1><p className="text-secondary mb-0">The backend will set the posted date and OPEN status automatically.</p></div>
                <Link to="/employer/jobs" className="btn btn-outline-primary mt-3 mt-md-0">Manage Jobs</Link>
            </div>
            <div className="card content-card"><div className="card-body p-4 p-md-5">
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
                <form onSubmit={handleSubmit} noValidate><div className="row g-3">
                    <div className="col-md-8"><label htmlFor="jobTitle" className="form-label">Job title</label><input id="jobTitle" name="jobTitle" maxLength="50" className="form-control" value={formData.jobTitle} onChange={handleChange} /></div>
                    <div className="col-md-4"><label htmlFor="category" className="form-label">Category</label><select id="category" name="category" className="form-select" value={formData.category} onChange={handleChange}>{categories.map((category) => <option key={category} value={category}>{category.replaceAll("_", " ")}</option>)}</select></div>
                    <div className="col-12"><label htmlFor="jobDescription" className="form-label">Description</label><textarea id="jobDescription" name="jobDescription" rows="4" className="form-control" value={formData.jobDescription} onChange={handleChange} /></div>
                    <div className="col-md-6"><label htmlFor="location" className="form-label">Location</label><input id="location" name="location" className="form-control" value={formData.location} onChange={handleChange} /></div>
                    <div className="col-md-3"><label htmlFor="budget" className="form-label">Budget (₹)</label><input id="budget" name="budget" type="number" min="0" step="0.01" className="form-control" value={formData.budget} onChange={handleChange} /></div>
                    <div className="col-md-3"><label htmlFor="deadline" className="form-label">Deadline</label><input id="deadline" name="deadline" type="date" min={today} className="form-control" value={formData.deadline} onChange={handleChange} /></div>
                </div><button className="btn btn-primary mt-4" disabled={loading}>{loading ? "Posting..." : "Post Job"}</button></form>
            </div></div>
        </div>
    );
}

export default CreateJob;
