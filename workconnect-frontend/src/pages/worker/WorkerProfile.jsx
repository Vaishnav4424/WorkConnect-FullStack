import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getApiErrorMessage } from "../../services/api";
import {
    completeWorkerProfile,
    updateWorkerProfile
} from "../../services/workerService";

const emptyProfile = {
    skillDescription: "",
    experienceYears: "",
    hourlyRate: "",
    profileDescription: ""
};

function WorkerProfile() {
    const { user } = useAuth();
    const completedKey = `workconnect_worker_profile_completed_${user.userId}`;
    const dataKey = `workconnect_worker_profile_data_${user.userId}`;
    const [isUpdateMode, setIsUpdateMode] = useState(
        () => localStorage.getItem(completedKey) === "true"
    );
    const [formData, setFormData] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem(dataKey)) || emptyProfile;
        } catch {
            return emptyProfile;
        }
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const validate = () => {
        if (!formData.skillDescription.trim()) {
            return "Skill description is required.";
        }
        if (formData.experienceYears === "" || Number(formData.experienceYears) < 0) {
            return "Experience years must be zero or greater.";
        }
        if (formData.hourlyRate === "" || Number(formData.hourlyRate) < 0) {
            return "Hourly rate must be zero or greater.";
        }
        return "";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        const validationError = validate();

        if (validationError) {
            setError(validationError);
            return;
        }

        const requestData = {
            userId: user.userId,
            skillDescription: formData.skillDescription.trim(),
            experienceYears: Number(formData.experienceYears),
            hourlyRate: Number(formData.hourlyRate),
            profileDescription: formData.profileDescription.trim()
        };

        try {
            setLoading(true);
            const response = isUpdateMode
                ? await updateWorkerProfile(requestData)
                : await completeWorkerProfile(requestData);

            localStorage.setItem(completedKey, "true");
            localStorage.setItem(dataKey, JSON.stringify(formData));
            setIsUpdateMode(true);
            setSuccess(response.data.message || "Worker profile saved successfully.");
        } catch (requestError) {
            if (requestError.response?.status === 409) {
                localStorage.setItem(completedKey, "true");
                setIsUpdateMode(true);
                setError("A worker profile already exists for this account. You can update it instead.");
            } else {
                setError(getApiErrorMessage(requestError, "Unable to save worker profile."));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4 py-md-5">
            <div className="page-header">
                <span className="eyebrow">Worker account</span>
                <h1 className="h2 fw-bold mt-2">{isUpdateMode ? "Update" : "Complete"} Worker Profile</h1>
                <p className="text-secondary mb-0">Your account ID is taken automatically from your login token.</p>
            </div>

            <div className="card content-card">
                <div className="card-body p-4 p-md-5">
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="mb-3">
                            <label htmlFor="skillDescription" className="form-label">Skills</label>
                            <textarea
                                id="skillDescription"
                                name="skillDescription"
                                className="form-control"
                                rows="3"
                                placeholder="Example: Electrician and appliance repair"
                                value={formData.skillDescription}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label htmlFor="experienceYears" className="form-label">Experience (years)</label>
                                <input id="experienceYears" name="experienceYears" type="number" min="0" className="form-control" value={formData.experienceYears} onChange={handleChange} />
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="hourlyRate" className="form-label">Hourly rate (₹)</label>
                                <input id="hourlyRate" name="hourlyRate" type="number" min="0" step="0.01" className="form-control" value={formData.hourlyRate} onChange={handleChange} />
                            </div>
                            <div className="col-12">
                                <label htmlFor="profileDescription" className="form-label">About you <span className="text-secondary">(optional)</span></label>
                                <textarea id="profileDescription" name="profileDescription" className="form-control" rows="4" value={formData.profileDescription} onChange={handleChange} />
                            </div>
                        </div>
                        <button className="btn btn-primary mt-4" disabled={loading}>
                            {loading ? "Saving..." : isUpdateMode ? "Update Profile" : "Complete Profile"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default WorkerProfile;
