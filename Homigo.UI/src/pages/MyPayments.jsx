import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getMyPayments } from "../services/paymentService";

function MyPayments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const data = await getMyPayments();

      setPayments(data);
    } catch {
      toast.error("Failed to load payments.");
    }
  };

const getStatusStyle = (status) => {
  switch (status) {
    case "Paid":
      return "bg-emerald-100 text-emerald-700 border border-emerald-200";

    case "Refunded":
      return "bg-red-100 text-red-700 border border-red-200";

    default:
      return "bg-slate-100 text-slate-700 border border-slate-200";
  }
};
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-8 flex items-center gap-3 text-4xl font-bold">
  💳 My Payments
</h1>

      {payments.length === 0 ? (
        <div className="rounded-2xl bg-slate-100 p-10 text-center">
          <h2 className="text-2xl font-semibold">
            No payments found
          </h2>
        </div>
      ) : (
        <div className="space-y-6">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="rounded-2xl bg-white p-6 shadow"
            >
              <div className="flex items-center justify-between">
               <h2 className="flex items-center gap-2 text-2xl font-bold">
  🧹 {payment.serviceName}
</h2>

                <span
                  className={`rounded-full px-4 py-2 text-sm font-medium ${getStatusStyle(
                    payment.status
                  )}`}
                >
                  {payment.status === "Paid" ? "✅ Paid" : "↩️ Refunded"}
                </span>
              </div>

              <div className="mt-5 space-y-2 text-slate-600">
                <p>
                  <strong>Amount:</strong>{" "}
                  {payment.amount} ₼
                </p>

                <p>
                  <strong>Method:</strong>{" "}
                  {payment.paymentMethod}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(payment.createdAt).toLocaleString()}
                </p>

                <p className="break-all">
                  <strong>Transaction:</strong>{" "}
                  {payment.transactionId.length > 18
  ? `${payment.transactionId.slice(0, 8)}...${payment.transactionId.slice(-6)}`
  : payment.transactionId}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyPayments;