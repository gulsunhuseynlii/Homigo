import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import { register } from "../services/authService";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phoneNumber: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ==================================================
  // PASSWORD VALIDATION
  // ==================================================

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }

    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter.";
    }

    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter.";
    }

    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number.";
    }

    if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]/`~';+=]/.test(password)) {
      return "Password must contain at least one special character.";
    }

    return null;
  };

  // ==================================================
  // SUBMIT
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.fullName ||
      !form.email ||
      !form.password ||
      !form.phoneNumber
    ) {
      toast.error(
        "Please fill in all fields."
      );

      return;
    }

    // Password validation
    const passwordError =
      validatePassword(form.password);

    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    try {
      setLoading(true);

      await register(form);

      toast.success(
        "Registration successful. Please verify your email."
      );

      navigate("/login");
    } catch (error) {
      console.error(
        "REGISTER ERROR:",
        error
      );

      toast.error(
        typeof error.response?.data === "string"
          ? error.response.data
          : error.response?.data?.message ||
              "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // PASSWORD RULE CHECKS
  // ==================================================

  const password = form.password;

  const passwordRules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special:
      /[!@#$%^&*(),.?":{}|<>_\-\\[\]/`~';+=]/.test(
        password
      ),
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-slate-50 px-6 py-12">

      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl md:grid-cols-2">

        {/* LEFT SIDE */}

        <div className="relative hidden overflow-hidden bg-blue-600 p-10 text-white md:flex md:flex-col md:justify-between">

          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500 opacity-50" />

          <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-blue-700 opacity-50" />

          <div className="relative z-10">

            <div className="mb-10 text-3xl font-extrabold">
              Homigo
            </div>

            <h1 className="text-4xl font-bold leading-tight">
              Join Homigo today!
            </h1>

            <p className="mt-5 max-w-sm text-lg leading-7 text-blue-100">
              Create your account and discover trusted
              professionals for all your everyday needs.
            </p>

          </div>

          <div className="relative z-10 rounded-2xl bg-white/10 p-5 backdrop-blur-sm">

            <p className="text-sm text-blue-100">
              Everything you need, in one place.
            </p>

            <p className="mt-1 text-lg font-semibold">
              Welcome to Homigo.
            </p>

          </div>

        </div>

        {/* RIGHT SIDE */}

        <div className="p-8 sm:p-12">

          <div className="mx-auto max-w-md">

            {/* HEADER */}

            <div className="mb-8">

              <h2 className="text-3xl font-bold text-slate-900">
                Create account
              </h2>

              <p className="mt-2 text-slate-500">
                Create your Homigo account to get started.
              </p>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* FULL NAME */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>

                <div className="relative">

                  <FaUser
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={15}
                  />

                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={form.fullName}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />

                </div>

              </div>

              {/* EMAIL */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>

                <div className="relative">

                  <FaEnvelope
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={15}
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

            <div>
  <label className="mb-2 block text-sm font-semibold text-slate-700">
    Phone Number
  </label>

  <div className="flex">
    <div className="flex items-center rounded-l-xl border border-r-0 border-slate-300 bg-slate-100 px-4 text-slate-700">
      +994
    </div>

    <input
      type="tel"
      name="phoneNumber"
      value={form.phoneNumber}
      onChange={(e) => {
        const value = e.target.value.replace(/\D/g, "");

        setForm((prev) => ({
          ...prev,
          phoneNumber: value,
        }));
      }}
      placeholder="50 123 45 67"
      maxLength={9}
      className="w-full rounded-r-xl border border-slate-300 bg-white p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      required
    />
  </div>
</div>

              {/* PASSWORD */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>

                <div className="relative">

                  <FaLock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={15}
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    placeholder="Create a password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
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

                {/* PASSWORD RULES */}

                <div className="mt-3 space-y-1.5 text-sm">

                  <p
                    className={
                      passwordRules.length
                        ? "text-green-600"
                        : "text-slate-400"
                    }
                  >
                    {passwordRules.length
                      ? "✓"
                      : "○"}{" "}
                    At least 8 characters
                  </p>

                  <p
                    className={
                      passwordRules.uppercase
                        ? "text-green-600"
                        : "text-slate-400"
                    }
                  >
                    {passwordRules.uppercase
                      ? "✓"
                      : "○"}{" "}
                    At least one uppercase letter
                  </p>

                  <p
                    className={
                      passwordRules.lowercase
                        ? "text-green-600"
                        : "text-slate-400"
                    }
                  >
                    {passwordRules.lowercase
                      ? "✓"
                      : "○"}{" "}
                    At least one lowercase letter
                  </p>

                  <p
                    className={
                      passwordRules.number
                        ? "text-green-600"
                        : "text-slate-400"
                    }
                  >
                    {passwordRules.number
                      ? "✓"
                      : "○"}{" "}
                    At least one number
                  </p>

                  <p
                    className={
                      passwordRules.special
                        ? "text-green-600"
                        : "text-slate-400"
                    }
                  >
                    {passwordRules.special
                      ? "✓"
                      : "○"}{" "}
                    At least one special character
                  </p>

                </div>

              </div>

              {/* REGISTER BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Creating account..."
                  : "Create account"}
              </button>

            </form>

            {/* LOGIN */}

            <div className="mt-8 text-center text-sm text-slate-500">

              Already have an account?{" "}

              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Sign in
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;