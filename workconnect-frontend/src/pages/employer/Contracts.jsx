import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import StatusBadge from "../../components/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { getApiErrorMessage } from "../../services/api";
import {
    deleteContract,
    getContractById,
    getEmployerContracts,
    updateContractStatus
} from "../../services/contractService";
import {
    createPayment,
    createRazorpayOrder,
    getPaymentsByContract,
    verifyRazorpayPayment
} from "../../services/paymentService";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });
const displayDate = (value) => value ? new Date(`${value}T00:00:00`).toLocaleDateString("en-IN") : "-";

const loadRazorpayCheckout = () => {
    if (window.Razorpay) return Promise.resolve(true);

    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

function EmployerContracts() {
    const { user } = useAuth();
    const [contracts, setContracts] = useState([]);
    const [selectedContract, setSelectedContract] = useState(null);
    const [paymentHistory, setPaymentHistory] = useState(null);
    const [paymentContract, setPaymentContract] = useState(null);
    const [paymentForm, setPaymentForm] = useState({ amount: "", paymentMethod: "CASH" });
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const fetchContracts = async () => {
        try {
            const response = await getEmployerContracts(user.userId);
            setContracts(response.data);
        } catch (requestError) {
            setError(getApiErrorMessage(requestError, "Unable to load contracts."));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadInitialContracts = async () => {
            try {
                const response = await getEmployerContracts(user.userId);
                setContracts(response.data);
            } catch (requestError) {
                setError(getApiErrorMessage(requestError, "Unable to load contracts."));
            } finally {
                setLoading(false);
            }
        };

        loadInitialContracts();
    }, [user.userId]);

    const showDetails = async (contractId) => {
        try {
            setActionLoading(true);
            const response = await getContractById(contractId);
            setSelectedContract(response.data);
        } catch (requestError) {
            setError(getApiErrorMessage(requestError, "Unable to load contract details."));
        } finally {
            setActionLoading(false);
        }
    };

    const handleStatus = async (contract, status) => {
        if (status === "CANCELLED" && !window.confirm(`Cancel contract #${contract.contractId}?`)) return;
        try {
            setActionLoading(true);
            setError("");
            const response = await updateContractStatus(contract.contractId, status);
            setSuccess(response.data.message || "Contract status updated.");
            await fetchContracts();
        } catch (requestError) {
            setError(getApiErrorMessage(requestError, "Unable to update contract status."));
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (contract) => {
        if (!window.confirm(`Permanently delete cancelled contract #${contract.contractId}?`)) return;
        try {
            setActionLoading(true);
            const response = await deleteContract(contract.contractId);
            setSuccess(response.data.message || "Contract deleted successfully.");
            await fetchContracts();
        } catch (requestError) {
            setError(getApiErrorMessage(requestError, "Unable to delete contract."));
        } finally {
            setActionLoading(false);
        }
    };

    const showPayments = async (contract) => {
        try {
            setActionLoading(true);
            const response = await getPaymentsByContract(contract.contractId);
            setPaymentHistory({ contract, items: response.data });
        } catch (requestError) {
            setError(getApiErrorMessage(requestError, "Unable to load payments."));
        } finally {
            setActionLoading(false);
        }
    };

    const refreshOpenPayments = async (contract) => {
        const response = await getPaymentsByContract(contract.contractId);
        setPaymentHistory({ contract, items: response.data });
    };

    const openPayment = (contract) => {
        setPaymentContract(contract);
        setPaymentForm({ amount: contract.agreedAmount || "", paymentMethod: "CASH" });
        setError("");
    };

    const handlePayment = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (Number(paymentForm.amount) <= 0) {
            setError("Payment amount must be greater than zero.");
            return;
        }

        const requestData = {
            contractId: paymentContract.contractId,
            amount: Number(paymentForm.amount),
            paymentMethod: paymentForm.paymentMethod
        };

        try {
            setActionLoading(true);

            if (paymentForm.paymentMethod !== "RAZORPAY") {
                await createPayment(requestData);
                setSuccess("Payment created with PENDING status.");
                setPaymentContract(null);
                await showPayments(paymentContract);
                return;
            }

            const scriptReady = await loadRazorpayCheckout();
            if (!scriptReady) {
                setError("Razorpay Checkout could not be loaded. Please check your connection and try again.");
                return;
            }

            const orderResponse = await createRazorpayOrder(requestData);
            const order = orderResponse.data;
            const currentContract = paymentContract;
            setPaymentContract(null);

            const checkout = new window.Razorpay({
                key: order.keyId,
                amount: Math.round(Number(order.amount) * 100),
                currency: order.currency || "INR",
                order_id: order.orderId,
                name: "WorkConnect",
                description: `Payment for contract #${currentContract.contractId}`,
                prefill: { name: user.firstName, email: user.email },
                theme: { color: "#2f80ed" },
                handler: async (razorpayResponse) => {
                    try {
                        setActionLoading(true);
                        await verifyRazorpayPayment({
                            razorpayOrderId: razorpayResponse.razorpay_order_id,
                            razorpayPaymentId: razorpayResponse.razorpay_payment_id,
                            razorpaySignature: razorpayResponse.razorpay_signature,
                            paymentId: order.paymentId
                        });
                        setSuccess("Razorpay payment verified successfully.");
                        await refreshOpenPayments(currentContract);
                    } catch (requestError) {
                        setError(getApiErrorMessage(requestError, "Payment verification failed."));
                    } finally {
                        setActionLoading(false);
                    }
                },
                modal: {
                    ondismiss: () => setError("Razorpay checkout was closed before payment was completed.")
                }
            });
            checkout.open();
        } catch (requestError) {
            setError(getApiErrorMessage(requestError, "Unable to create payment."));
        } finally {
            setActionLoading(false);
        }
    };

    const actionButtons = (contract) => (
        <div className="d-flex flex-wrap gap-2">
            <button className="btn btn-sm btn-outline-primary" disabled={actionLoading} onClick={() => showDetails(contract.contractId)}>Details</button>
            <button className="btn btn-sm btn-outline-primary" disabled={actionLoading} onClick={() => showPayments(contract)}>Payments</button>
            {!["CANCELLED"].includes(contract.contractStatus) && <button className="btn btn-sm btn-primary" onClick={() => openPayment(contract)}>Make Payment</button>}
            {contract.contractStatus === "ACTIVE" && <><button className="btn btn-sm btn-success" disabled={actionLoading} onClick={() => handleStatus(contract, "IN_PROGRESS")}>Start Work</button><button className="btn btn-sm btn-outline-danger" disabled={actionLoading} onClick={() => handleStatus(contract, "CANCELLED")}>Cancel</button></>}
            {contract.contractStatus === "IN_PROGRESS" && <button className="btn btn-sm btn-success" disabled={actionLoading} onClick={() => handleStatus(contract, "COMPLETED")}>Mark Completed</button>}
            {contract.contractStatus === "CANCELLED" && <button className="btn btn-sm btn-danger" disabled={actionLoading} onClick={() => handleDelete(contract)}>Delete</button>}
        </div>
    );

    return (
        <div className="container py-4 py-md-5">
            <div className="page-header"><span className="eyebrow">Employer contracts</span><h1 className="h2 fw-bold mt-2">Contracts & Payments</h1><p className="text-secondary mb-0">Follow the allowed contract transitions and manage payments.</p></div>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            {loading ? <Loader text="Loading contracts..." /> : contracts.length === 0 ? <div className="card content-card empty-state">No contracts found. Accept an applicant and create a contract first.</div> : <div className="card content-card"><div className="table-responsive"><table className="table mb-0"><thead><tr><th>Contract</th><th>Job / Worker</th><th>Dates</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead><tbody>{contracts.map((contract) => <tr key={contract.contractId}><td>#{contract.contractId}</td><td><strong>{contract.jobTitle}</strong><div className="small text-secondary">{contract.workerName}</div></td><td>{displayDate(contract.startDate)}<br /><span className="small text-secondary">to {displayDate(contract.endDate)}</span></td><td>{money.format(contract.agreedAmount || 0)}</td><td><StatusBadge status={contract.contractStatus} /></td><td>{actionButtons(contract)}</td></tr>)}</tbody></table></div></div>}

            {selectedContract && <div className="modal-backdrop-custom"><div className="modal-panel"><div className="p-4 border-bottom d-flex justify-content-between"><h2 className="h4 mb-0">Contract #{selectedContract.contractId}</h2><button className="btn-close" onClick={() => setSelectedContract(null)} /></div><div className="p-4"><dl className="row mb-0"><dt className="col-5">Job</dt><dd className="col-7">{selectedContract.jobTitle}</dd><dt className="col-5">Worker</dt><dd className="col-7">{selectedContract.workerName}</dd><dt className="col-5">Application ID</dt><dd className="col-7">#{selectedContract.applicationId}</dd><dt className="col-5">Start</dt><dd className="col-7">{displayDate(selectedContract.startDate)}</dd><dt className="col-5">End</dt><dd className="col-7">{displayDate(selectedContract.endDate)}</dd><dt className="col-5">Amount</dt><dd className="col-7">{money.format(selectedContract.agreedAmount || 0)}</dd><dt className="col-5">Status</dt><dd className="col-7"><StatusBadge status={selectedContract.contractStatus} /></dd></dl></div></div></div>}

            {paymentContract && <div className="modal-backdrop-custom"><div className="modal-panel"><form onSubmit={handlePayment}><div className="p-4 border-bottom"><h2 className="h4 mb-1">Make Payment</h2><p className="text-secondary mb-0">Contract #{paymentContract.contractId} · {paymentContract.workerName}</p></div><div className="p-4"><div className="mb-3"><label className="form-label">Amount (₹)</label><input type="number" min="0.01" step="0.01" className="form-control" value={paymentForm.amount} onChange={(event) => setPaymentForm({ ...paymentForm, amount: event.target.value })} /></div><div><label className="form-label">Payment method</label><select className="form-select" value={paymentForm.paymentMethod} onChange={(event) => setPaymentForm({ ...paymentForm, paymentMethod: event.target.value })}><option value="CASH">Cash</option><option value="BANK_TRANSFER">Bank Transfer</option><option value="RAZORPAY">Razorpay</option></select></div><p className="form-text mb-0 mt-3">Cash and bank transfer payments start as PENDING. Razorpay success is confirmed by backend verification.</p></div><div className="p-4 border-top d-flex justify-content-end gap-2"><button type="button" className="btn btn-outline-secondary" onClick={() => setPaymentContract(null)}>Cancel</button><button className="btn btn-primary" disabled={actionLoading}>{actionLoading ? "Processing..." : "Continue"}</button></div></form></div></div>}

            {paymentHistory && <div className="modal-backdrop-custom"><div className="modal-panel modal-lg-custom"><div className="p-4 border-bottom d-flex justify-content-between"><div><h2 className="h4 mb-1">Contract Payments</h2><p className="text-secondary mb-0">Contract #{paymentHistory.contract.contractId} · {paymentHistory.contract.jobTitle}</p></div><button className="btn-close" onClick={() => setPaymentHistory(null)} /></div><div className="p-4">{paymentHistory.items.length === 0 ? <div className="empty-state">No payments found for this contract.</div> : <div className="table-responsive"><table className="table"><thead><tr><th>ID</th><th>Amount</th><th>Method</th><th>Date</th><th>Status</th></tr></thead><tbody>{paymentHistory.items.map((payment) => <tr key={payment.paymentId}><td>#{payment.paymentId}</td><td>{money.format(payment.amount || 0)}</td><td>{payment.paymentMethod.replaceAll("_", " ")}</td><td>{displayDate(payment.paymentDate)}</td><td><StatusBadge status={payment.paymentStatus} /></td></tr>)}</tbody></table></div>}</div></div></div>}
        </div>
    );
}

export default EmployerContracts;
