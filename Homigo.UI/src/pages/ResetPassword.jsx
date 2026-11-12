import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import { resetPassword } from "../services/authService";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid reset link.");
      return;
    }

    if (!password) {
      toast.error("Please enter a new password.");
      return;
    }

    if (password.length < 8) {
      toast.error(
        "Password must be at least 8 characters."
      );
      return;
    }

    try {
      setLoading(true);

      await resetPassword(
        token,
        password
      );

      toast.success(
        "Password reset successfully!"
      );

      navigate("/login");

    } catch (error) {
      console.error(
        "RESET PASSWORD ERROR:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to reset password."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-50 px-6 py-12">

      <div className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-xl sm:p-10">

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-slate-900">
            Reset Password
          </h1>

          <p className="mt-2 text-slate-500">
            Create a new password for your Homigo account.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
              New Password
            </label>

            <div className="relative">

              <FaLock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                placeholder="Enter new password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPassword ? (
                  <FaEyeSlash size={17} />
                ) : (
                  <FaEye size={17} />
                )}
              </button>

            </div>

          </div>

          <div className="rounded-xl bg-slate-50 p-4 text-sm">

            <p className="mb-2 font-semibold text-slate-700">
              Password requirements:
            </p>

            <ul className="space-y-1 text-slate-500">

              <li>• At least 8 characters</li>
              <li>• At least one uppercase letter</li>
              <li>• At least one lowercase letter</li>
              <li>• At least one number</li>
              <li>• At least one special character</li>

            </ul>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading
              ? "Resetting..."
              : "Reset Password"}
          </button>

        </form>

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

export default ResetPassword;