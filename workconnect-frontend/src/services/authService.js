import api from "./api";

export const registerUser = (userData) => {
    return api.post("/users/signup", userData);
};

export const loginUser = (loginData) => {
    return api.post("/users/signin", loginData);
};