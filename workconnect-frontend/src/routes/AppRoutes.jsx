import { BrowserRouter, Routes, Route } from "react-router-dom";

// Public Pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

// Worker Pages
import WorkerDashboard from "../pages/worker/WorkerDashboard";
import WorkerProfile from "../pages/worker/WorkerProfile";
import SearchJobs from "../pages/worker/SearchJobs";
import AppliedJobs from "../pages/worker/AppliedJobs";
import WorkerContracts from "../pages/worker/Contracts";

// Employer Pages
import EmployerDashboard from "../pages/employer/EmployerDashboard";
import EmployerProfile from "../pages/employer/EmployerProfile";
import CreateJob from "../pages/employer/CreateJob";
import ManageJobs from "../pages/employer/ManageJobs";
import Applicants from "../pages/employer/Applicants";
import EmployerContracts from "../pages/employer/Contracts";

// Protected Route
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {

    return (
        <BrowserRouter>

            <Routes>

                {/* ================= PUBLIC ================= */}

                <Route path="/" element={<Home />} />

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />


                {/* ================= WORKER ================= */}

                <Route
                    path="/worker/dashboard"
                    element={
                        <ProtectedRoute allowedRole="WORKER">
                            <WorkerDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/worker/profile"
                    element={
                        <ProtectedRoute allowedRole="WORKER">
                            <WorkerProfile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/worker/jobs"
                    element={
                        <ProtectedRoute allowedRole="WORKER">
                            <SearchJobs />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/worker/applications"
                    element={
                        <ProtectedRoute allowedRole="WORKER">
                            <AppliedJobs />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/worker/contracts"
                    element={
                        <ProtectedRoute allowedRole="WORKER">
                            <WorkerContracts />
                        </ProtectedRoute>
                    }
                />


                {/* ================= EMPLOYER ================= */}

                <Route
                    path="/employer/dashboard"
                    element={
                        <ProtectedRoute allowedRole="EMPLOYER">
                            <EmployerDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/employer/profile"
                    element={
                        <ProtectedRoute allowedRole="EMPLOYER">
                            <EmployerProfile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/employer/jobs/create"
                    element={
                        <ProtectedRoute allowedRole="EMPLOYER">
                            <CreateJob />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/employer/jobs"
                    element={
                        <ProtectedRoute allowedRole="EMPLOYER">
                            <ManageJobs />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/employer/jobs/:jobId/applicants"
                    element={
                        <ProtectedRoute allowedRole="EMPLOYER">
                            <Applicants />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/employer/contracts"
                    element={
                        <ProtectedRoute allowedRole="EMPLOYER">
                            <EmployerContracts />
                        </ProtectedRoute>
                    }
                />


                {/* ================= 404 ================= */}

                <Route
                    path="*"
                    element={
                        <h2 className="text-center mt-5">
                            404 - Page Not Found
                        </h2>
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default AppRoutes;


