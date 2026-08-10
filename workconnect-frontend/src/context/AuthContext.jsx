/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

const readUserFromToken = (token) => {
    const decodedToken = jwtDecode(token);

    if (decodedToken.exp && decodedToken.exp * 1000 <= Date.now()) {
        throw new Error("Token has expired");
    }

    return {
        userId: decodedToken.userId,
        email: decodedToken.sub,
        role: decodedToken.role,
        firstName: decodedToken.firstName,
        expiresAt: decodedToken.exp ? decodedToken.exp * 1000 : null
    };
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            return null;
        }

        try {
            return readUserFromToken(token);
        } catch {
            localStorage.removeItem("token");
            return null;
        }
    });

    const login = (token) => {
        try {
            const userData = readUserFromToken(token);
            localStorage.setItem("token", token);
            setUser(userData);
            return userData;
        } catch {
            localStorage.removeItem("token");
            setUser(null);
            return null;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    useEffect(() => {
        const clearAuthentication = () => setUser(null);
        const syncAuthentication = () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setUser(null);
                return;
            }

            try {
                setUser(readUserFromToken(token));
            } catch {
                logout();
            }
        };

        window.addEventListener("workconnect-auth-expired", clearAuthentication);
        window.addEventListener("storage", syncAuthentication);

        return () => {
            window.removeEventListener("workconnect-auth-expired", clearAuthentication);
            window.removeEventListener("storage", syncAuthentication);
        };
    }, []);

    useEffect(() => {
        if (!user?.expiresAt) {
            return undefined;
        }

        const remainingTime = user.expiresAt - Date.now();

        const timeoutId = window.setTimeout(() => {
            sessionStorage.setItem(
                "workconnect_session_message",
                "Your session has expired. Please log in again."
            );
            logout();
            window.location.assign("/login?session=expired");
        }, Math.max(remainingTime, 0));

        return () => window.clearTimeout(timeoutId);
    }, [user?.expiresAt]);

    return (
        <AuthContext.Provider
            value={{ user, login, logout, isAuthenticated: Boolean(user) }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
