import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getApiErrorMessage } from "../../services/api";
import {
    completeEmployerProfile,
    updateEmployerProfile
} from "../../services/employerService";

const emptyProfile = {
    organizationName: "",
    organizationDescription: "",
    organizationAddress: "",
    city: "",
    state: "",
    pincode: "",
    gstNumber: "",
    contactPerson: ""
};

function EmployerProfile() {
    const { user } = useAuth();
    const completedKey = `workconnect_employer_profile_completed_${user.userId}`;
    const dataKey = `workconnect_employer_profile_data_${user.userId}`;
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
        setFormData({
            ...formData,
            [name]: name === "gstNumber" ? value.toUpperCase() : value
        });
    };

    const validate = () => {
        if (!formData.organizationName.trim() || !formData.organizationAddress.trim() ||
            !formData.city.trim() || !formData.state.trim() || !formData.contactPerson.trim()) {
            return "Please fill in all required fields.";
        }
        if (formData.organizationName.trim().length > 100) {
            return "Organization name cannot exceed 100 characters.";
        }
        if (!/^\d{6}$/.test(formData.pincode)) {
            return "Pincode must contain exactly 6 digits.";
        }
        const gstPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
        if (formData.gstNumber && !gstPattern.test(formData.gstNumber)) {
            return "Please enter a valid GST number or leave it empty.";
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
            organizationName: formData.organizationName.trim(),
            organizationDescription: formData.organizationDescription.trim(),
            organizationAddress: formData.organizationAddress.trim(),
            city: formData.city.trim(),
            state: formData.state.trim(),
            pincode: formData.pincode,
            gstNumber: formData.gstNumber,
            contactPerson: formData.contactPerson.trim()
        };

        try {
            setLoading(true);
            const response = isUpdateMode
                ? await updateEmployerProfile(requestData)
                : await completeEmployerProfile(requestData);

            localStorage.setItem(completedKey, "true");
            localStorage.setItem(dataKey, JSON.stringify(formData));
            setIsUpdateMode(true);
            setSuccess(response.data.message || "Employer profile saved successfully.");
        } catch (requestError) {
            if (requestError.response?.status === 409) {
                localStorage.setItem(completedKey, "true");
                setIsUpdateMode(true);
                setError("An employer profile already exists for this account. You can update it instead.");
            } else {
                setError(getApiErrorMessage(requestError, "Unable to save employer profile."));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4 py-md-5">
            <div className="page-header">
                <span className="eyebrow">Employer account</span>
                <h1 className="h2 fw-bold mt-2">{isUpdateMode ? "Update" : "Complete"} Employer Profile</h1>
                <p className="text-secondary mb-0">Organization details are written to your existing backend profile API.</p>
            </div>
            <div className="card content-card">
                <div className="card-body p-4 p-md-5">
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="row g-3">
                            <div className="col-md-7">
                                <label className="form-label" htmlFor="organizationName">Organization name</label>
                                <input id="organizationName" name="organizationName" maxLength="100" className="form-control" value={formData.organizationName} onChange={handleChange} />
                            </div>
                            <div className="col-md-5">
                                <label className="form-label" htmlFor="contactPerson">Contact person</label>
                                <input id="contactPerson" name="contactPerson" maxLength="100" className="form-control" value={formData.contactPerson} onChange={handleChange} />
                            </div>
                            <div className="col-12">
                                <label className="form-label" htmlFor="organizationDescription">Organization description <span className="text-secondary">(optional)</span></label>
                                <textarea id="organizationDescription" name="organizationDescription" maxLength="500" rows="3" className="form-control" value={formData.organizationDescription} onChange={handleChange} />
                            </div>
                            <div className="col-12">
                                <label className="form-label" htmlFor="organizationAddress">Organization address</label>
                                <textarea id="organizationAddress" name="organizationAddress" maxLength="255" rows="2" className="form-control" value={formData.organizationAddress} onChange={handleChange} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label" htmlFor="city">City</label>
                                <input id="city" name="city" maxLength="100" className="form-control" value={formData.city} onChange={handleChange} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label" htmlFor="state">State</label>
                                <input id="state" name="state" maxLength="100" className="form-control" value={formData.state} onChange={handleChange} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label" htmlFor="pincode">Pincode</label>
                                <input id="pincode" name="pincode" inputMode="numeric" maxLength="6" className="form-control" value={formData.pincode} onChange={handleChange} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label" htmlFor="gstNumber">GST number <span className="text-secondary">(optional)</span></label>
                                <input id="gstNumber" name="gstNumber" maxLength="15" className="form-control text-uppercase" value={formData.gstNumber} onChange={handleChange} />
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

export default EmployerProfile;
