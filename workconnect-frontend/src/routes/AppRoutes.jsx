import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Applicants from "../pages/employer/Applicants";
import EmployerContracts from "../pages/employer/Contracts";
import CreateJob from "../pages/employer/CreateJob";
import EmployerDashboard from "../pages/employer/EmployerDashboard";
import EmployerProfile from "../pages/employer/EmployerProfile";
import ManageJobs from "../pages/employer/ManageJobs";
import Payments from "../pages/employer/Payments";
import AppliedJobs from "../pages/worker/AppliedJobs";
import WorkerContracts from "../pages/worker/Contracts";
import SearchJobs from "../pages/worker/SearchJobs";
import WorkerDashboard from "../pages/worker/WorkerDashboard";
import WorkerProfile from "../pages/worker/WorkerProfile";
import ProtectedRoute from "./ProtectedRoute";

const workerRoute = (component) => (
    <ProtectedRoute allowedRole="WORKER">{component}</ProtectedRoute>
);

const employerRoute = (component) => (
    <ProtectedRoute allowedRole="EMPLOYER">{component}</ProtectedRoute>
);

function AppRoutes() {
    return (
        <BrowserRouter>
            <div className="app-shell">
                <Navbar />
                <main className="app-main">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route path="/worker/dashboard" element={workerRoute(<WorkerDashboard />)} />
                        <Route path="/worker/profile" element={workerRoute(<WorkerProfile />)} />
                        <Route path="/worker/jobs" element={workerRoute(<SearchJobs />)} />
                        <Route path="/worker/applications" element={workerRoute(<AppliedJobs />)} />
                        <Route path="/worker/contracts" element={workerRoute(<WorkerContracts />)} />

                        <Route path="/employer/dashboard" element={employerRoute(<EmployerDashboard />)} />
                        <Route path="/employer/profile" element={employerRoute(<EmployerProfile />)} />
                        <Route path="/employer/jobs/create" element={employerRoute(<CreateJob />)} />
                        <Route path="/employer/jobs" element={employerRoute(<ManageJobs />)} />
                        <Route path="/employer/jobs/:jobId/applicants" element={employerRoute(<Applicants />)} />
                        <Route path="/employer/contracts" element={employerRoute(<EmployerContracts />)} />
                        <Route path="/employer/payments" element={employerRoute(<Payments />)} />

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default AppRoutes;
