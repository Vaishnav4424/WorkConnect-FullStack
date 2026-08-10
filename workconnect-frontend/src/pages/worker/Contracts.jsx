import { useEffect, useState } from "react";
import Loader from "../../components/Loader";
import StatusBadge from "../../components/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { getApiErrorMessage } from "../../services/api";
import { getContractById, getWorkerContracts } from "../../services/contractService";
import { getPaymentById, getPaymentsByContract } from "../../services/paymentService";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });
const displayDate = (value) => value ? new Date(`${value}T00:00:00`).toLocaleDateString("en-IN") : "-";

function WorkerContracts() {
    const { user } = useAuth();
    const [contracts, setContracts] = useState([]);
    const [selectedContract, setSelectedContract] = useState(null);
    const [payments, setPayments] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadContracts = async () => {
            try {
                const response = await getWorkerContracts(user.userId);
                setContracts(response.data);
            } catch (requestError) {
                setError(getApiErrorMessage(requestError, "Unable to load contracts."));
            } finally {
                setLoading(false);
            }
        };
        loadContracts();
    }, [user.userId]);

    const showContract = async (contractId) => {
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

    const showPayments = async (contract) => {
        try {
            setActionLoading(true);
            const response = await getPaymentsByContract(contract.contractId);
            setPayments({ contract, items: response.data });
        } catch (requestError) {
            setError(getApiErrorMessage(requestError, "Unable to load payment history."));
        } finally {
            setActionLoading(false);
        }
    };

    const showPaymentDetails = async (paymentId) => {
        try {
            setActionLoading(true);
            const response = await getPaymentById(paymentId);
            setSelectedPayment(response.data);
        } catch (requestError) {
            setError(getApiErrorMessage(requestError, "Unable to load payment details."));
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="container py-4 py-md-5">
            <div className="page-header"><span className="eyebrow">Worker contracts</span><h1 className="h2 fw-bold mt-2">Contracts & Payments</h1><p className="text-secondary mb-0">Inspect your agreements and payment history.</p></div>
            {error && <div className="alert alert-danger">{error}</div>}
            {loading ? <Loader text="Loading contracts..." /> : contracts.length === 0 ? <div className="card content-card empty-state">No contracts found.</div> : (
                <div className="card content-card"><div className="table-responsive"><table className="table mb-0"><thead><tr><th>Contract</th><th>Job / Employer</th><th>Dates</th><th>Amount</th><th>Status</th><th>Actions</th></tr></thead><tbody>{contracts.map((contract) => <tr key={contract.contractId}><td>#{contract.contractId}</td><td><strong>{contract.jobTitle}</strong><div className="small text-secondary">{contract.employerName}</div></td><td>{displayDate(contract.startDate)}<br /><span className="small text-secondary">to {displayDate(contract.endDate)}</span></td><td>{money.format(contract.agreedAmount || 0)}</td><td><StatusBadge status={contract.contractStatus} /></td><td><div className="d-flex flex-wrap gap-2"><button className="btn btn-sm btn-outline-primary" disabled={actionLoading} onClick={() => showContract(contract.contractId)}>Details</button><button className="btn btn-sm btn-primary" disabled={actionLoading} onClick={() => showPayments(contract)}>View Payments</button></div></td></tr>)}</tbody></table></div></div>
            )}

            {selectedContract && <div className="modal-backdrop-custom"><div className="modal-panel"><div className="p-4 border-bottom d-flex justify-content-between"><h2 className="h4 mb-0">Contract #{selectedContract.contractId}</h2><button className="btn-close" onClick={() => setSelectedContract(null)} /></div><div className="p-4"><dl className="row mb-0"><dt className="col-5">Job</dt><dd className="col-7">{selectedContract.jobTitle}</dd><dt className="col-5">Employer</dt><dd className="col-7">{selectedContract.employerName}</dd><dt className="col-5">Start date</dt><dd className="col-7">{displayDate(selectedContract.startDate)}</dd><dt className="col-5">End date</dt><dd className="col-7">{displayDate(selectedContract.endDate)}</dd><dt className="col-5">Agreed amount</dt><dd className="col-7">{money.format(selectedContract.agreedAmount || 0)}</dd><dt className="col-5">Status</dt><dd className="col-7"><StatusBadge status={selectedContract.contractStatus} /></dd></dl></div></div></div>}

            {payments && <div className="modal-backdrop-custom"><div className="modal-panel modal-lg-custom"><div className="p-4 border-bottom d-flex justify-content-between"><div><h2 className="h4 mb-1">Payment History</h2><p className="text-secondary mb-0">{payments.contract.jobTitle}</p></div><button className="btn-close" onClick={() => { setPayments(null); setSelectedPayment(null); }} /></div><div className="p-4">{payments.items.length === 0 ? <div className="empty-state">No payments found for this contract.</div> : <div className="table-responsive"><table className="table"><thead><tr><th>ID</th><th>Amount</th><th>Method</th><th>Date</th><th>Status</th><th></th></tr></thead><tbody>{payments.items.map((payment) => <tr key={payment.paymentId}><td>#{payment.paymentId}</td><td>{money.format(payment.amount || 0)}</td><td>{payment.paymentMethod.replaceAll("_", " ")}</td><td>{displayDate(payment.paymentDate)}</td><td><StatusBadge status={payment.paymentStatus} /></td><td><button className="btn btn-sm btn-outline-primary" onClick={() => showPaymentDetails(payment.paymentId)}>Details</button></td></tr>)}</tbody></table></div>}{selectedPayment && <div className="alert alert-light border mt-3 mb-0"><strong>Payment #{selectedPayment.paymentId}</strong><div>Contract #{selectedPayment.contractId} · {money.format(selectedPayment.amount || 0)} · {selectedPayment.paymentMethod.replaceAll("_", " ")}</div><StatusBadge status={selectedPayment.paymentStatus} /></div>}</div></div></div>}
        </div>
    );
}

export default WorkerContracts;
