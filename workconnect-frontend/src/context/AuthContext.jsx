import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            return null;
        }

        try {

            const decodedToken = jwtDecode(token);

            return {
                userId: decodedToken.userId,
                email: decodedToken.sub,
                role: decodedToken.role,
                firstName: decodedToken.firstName
            };

        } catch (error) {

            console.error("Invalid token:", error);

            localStorage.removeItem("token");

            return null;
        }
    });


    // Login
    const login = (token) => {

        try {

            const decodedToken = jwtDecode(token);

            localStorage.setItem("token", token);

            const userData = {
                userId: decodedToken.userId,
                email: decodedToken.sub,
                role: decodedToken.role,
                firstName: decodedToken.firstName
            };

            setUser(userData);

            return userData;

        } catch (error) {

            console.error("Unable to decode token:", error);

            return null;
        }
    };


    // Logout
    const logout = () => {

        localStorage.removeItem("token");

        setUser(null);
    };


    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};


// Custom Hook
export const useAuth = () => {

    return useContext(AuthContext);

};
