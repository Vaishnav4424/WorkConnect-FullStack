import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json"
    }
});

// Add JWT token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const token = localStorage.getItem("token");

        if (error.response?.status === 401 && token) {
            localStorage.removeItem("token");
            sessionStorage.setItem(
                "workconnect_session_message",
                "Your session has expired. Please log in again."
            );
            window.dispatchEvent(new Event("workconnect-auth-expired"));

            if (!window.location.pathname.startsWith("/login")) {
                window.location.assign("/login?session=expired");
            }
        }

        return Promise.reject(error);
    }
);

export const getApiErrorMessage = (
    error,
    fallback = "Something went wrong. Please try again."
) => {
    if (!error.response) {
        return "Unable to connect to the server. Please make sure the backend is running.";
    }

    const data = error.response.data;

    if (typeof data === "string") {
        return data || fallback;
    }

    const fieldErrors = data?.errors
        ? Object.entries(data.errors)
            .map(([field, message]) => `${field}: ${message}`)
            .join(" ")
        : "";

    if (data?.message && fieldErrors) {
        return `${data.message}. ${fieldErrors}`;
    }

    return data?.message || fieldErrors || fallback;
};

export default api;
