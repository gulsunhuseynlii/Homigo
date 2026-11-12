import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import { login } from "../services/authService";
import { saveToken } from "../utils/auth";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await login(form);

      console.log("LOGIN RESPONSE:", response.data);

      saveToken(response.data.token);

      toast.success("Login successful!");

      navigate("/");
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      console.log("STATUS:", error.response?.status);
      console.log("DATA:", error.response?.data);

      toast.error(
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message ||
              "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-50 px-6 py-12">

      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">

        {/* =========================
            LEFT SIDE
        ========================= */}

        <div className="relative hidden overflow-hidden bg-blue-600 p-10 text-white md:flex md:flex-col md:justify-between">

          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500 opacity-50" />

          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-blue-700 opacity-50" />

          <div className="relative z-10">

            <div className="mb-10 text-3xl font-extrabold">
              Homigo
            </div>

            <h1 className="text-4xl font-bold leading-tight">
              Welcome back!
            </h1>

            <p className="mt-5 max-w-sm text-lg leading-7 text-blue-100">
              Find trusted professionals for your
              everyday needs, or manage your services
              all in one place.
            </p>

          </div>

          <div className="relative z-10 rounded-2xl bg-white/10 p-5 backdrop-blur-sm">

            <p className="text-sm text-blue-100">
              Your trusted service marketplace
            </p>

            <p className="mt-1 text-lg font-semibold">
              Simple. Reliable. Homigo.
            </p>

          </div>

        </div>

        {/* =========================
            RIGHT SIDE
        ========================= */}

        <div className="p-8 sm:p-12">

          <div className="mx-auto max-w-md">

            {/* HEADER */}

            <div className="mb-8">

              <h2 className="text-3xl font-bold text-slate-900">
                Sign in
              </h2>

              <p className="mt-2 text-slate-500">
                Welcome back! Please enter your details.
              </p>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* EMAIL */}

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
                    name="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />

                </div>

              </div>

              {/* PASSWORD */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label className="block text-sm font-semibold text-slate-700">
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                  >
                    Forgot password?
                  </Link>

                </div>

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
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                  >
                    {showPassword ? (
                      <FaEyeSlash size={17} />
                    ) : (
                      <FaEye size={17} />
                    )}
                  </button>

                </div>

              </div>

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Signing in..."
                  : "Sign in"}
              </button>

            </form>

            {/* REGISTER */}

            <div className="mt-8 text-center text-sm text-slate-500">

              Don't have an account?{" "}

              <Link
                to="/register"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Create account
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;