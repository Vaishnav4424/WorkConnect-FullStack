import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRole }) {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRole && user.role !== allowedRole) {
        const destination = user.role === "EMPLOYER"
            ? "/employer/dashboard"
            : "/worker/dashboard";
        return <Navigate to={destination} replace />;
    }

    return children;
}

export default ProtectedRoute;
