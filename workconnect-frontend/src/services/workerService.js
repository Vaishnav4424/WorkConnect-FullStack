import api from "./api";

export const completeWorkerProfile = (data) => {
    return api.post("/workers/complete-profile", data);
};

export const updateWorkerProfile = (data) => {
    return api.put("/workers/update-profile", data);
};

export const searchJobs = (params) => {
    return api.get("/workers/jobs/search", { params });
};
