import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { createCheckoutSession } from "../services/paymentService";

function Payment() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [loading, setLoading] = useState(false);

  if (!state) {
    navigate("/");
    return null;
  }

  const handlePayment = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const result = await createCheckoutSession(
        state.orderId
      );

      window.location.href = result.url;
    } catch (error) {
      console.log(error.response);

      toast.error(
        error.response?.data?.message ??
          "Failed to start Stripe Checkout."
      );

      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="rounded-3xl bg-white p-10 shadow">

        <h1 className="mb-8 text-4xl font-bold">
          Stripe Payment
        </h1>

        <div className="space-y-4 rounded-2xl bg-slate-50 p-6">

          <div className="flex justify-between">
            <span className="font-semibold">
              Service
            </span>

            <span>{state.serviceName}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">
              Provider
            </span>

            <span>{state.providerName}</span>
          </div>

          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>

            <span>${state.totalPrice}</span>
          </div>

        </div>

        <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-5">

          <p className="font-semibold text-blue-700">
            Secure payment powered by Stripe
          </p>

          <p className="mt-2 text-sm text-slate-600">
            After clicking the button below you will
            be redirected to Stripe's secure payment
            page to complete your payment.
          </p>

        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className={`mt-8 w-full rounded-xl py-4 text-lg font-semibold text-white transition ${
            loading
              ? "cursor-not-allowed bg-slate-400"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {loading
            ? "Redirecting..."
            : "Continue to Stripe"}
        </button>

      </div>
    </div>
  );
}

export default Payment;