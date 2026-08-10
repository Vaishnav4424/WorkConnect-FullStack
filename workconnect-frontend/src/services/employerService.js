import api from "./api";

export const completeEmployerProfile = (data) => {
    return api.post("/employers/complete-profile", data);
};

export const updateEmployerProfile = (data) => {
    return api.put("/employers/update-profile", data);
};

export const getEmployerJobs = (employerId) => {
    return api.get(`/employers/${employerId}/jobs`);
};

export const createJob = (employerId, data) => {
    return api.post(`/employers/${employerId}/jobs`, data);
};
