import api from "./api";

export const getJobById = (jobId) => {
    return api.get(`/jobs/${jobId}`);
};

export const updateJob = (jobId, data) => {
    return api.put(`/jobs/${jobId}`, data);
};

export const deleteJob = (jobId) => {
    return api.delete(`/jobs/${jobId}`);
};
