import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEnvelope } from "react-icons/fa";

import { forgotPassword } from "../services/authService";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      await forgotPassword(email);

      setSent(true);

      toast.success(
        "If this email exists, a reset link has been sent."
      );
    } catch (error) {
      console.error("FORGOT PASSWORD ERROR:", error);

      toast.error(
        error.response?.data?.message ||
        "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-50 px-6 py-12">

      <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-xl sm:p-10">

        <div className="mb-8 text-center">

          <h1 className="text-3xl font-bold text-slate-900">
            Forgot Password?
          </h1>

          <p className="mt-3 text-slate-500">
            Enter your email and we'll send you a
            password reset link.
          </p>

        </div>

        {!sent ? (
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email
              </label>

              <div className="relative">

                <FaEnvelope
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />

              </div>

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading
                ? "Sending..."
                : "Send Reset Link"}
            </button>

          </form>
        ) : (

          <div className="text-center">

            <div className="mb-4 text-5xl">
              📧
            </div>

            <h2 className="text-xl font-bold text-slate-900">
              Check your email
            </h2>

            <p className="mt-3 text-sm text-slate-500">
              If an account exists with this email,
              you will receive a password reset link.
            </p>

          </div>

        )}

        <div className="mt-8 text-center">

          <Link
            to="/login"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            ← Back to Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;