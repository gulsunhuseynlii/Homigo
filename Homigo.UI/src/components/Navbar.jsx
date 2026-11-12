import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { getUnreadCount } from "../services/chatService";
import { getProfile } from "../services/userService";

import {
  isAuthenticated,
  logout,
  getRole,
} from "../utils/auth";

import {
  onMessagesRead,
  onUnreadCountChanged,
  onReceiveMessage,
} from "../services/chatHub";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [role, setRole] = useState(getRole());

  const [unreadCount, setUnreadCount] = useState(0);
  const [profile, setProfile] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);

  // =========================
  // LOAD UNREAD COUNT
  // =========================

  const loadUnreadCount = async () => {
    if (!isAuthenticated()) {
      setUnreadCount(0);
      return;
    }

    try {
      const count = await getUnreadCount();

      setUnreadCount(count);
    } catch (error) {
      console.error(
        "Failed to load unread count",
        error
      );
    }
  };

  // =========================
  // LOAD PROFILE
  // =========================

  const loadProfile = async () => {
    if (!isAuthenticated()) {
      setProfile(null);
      return;
    }

    try {
      const data = await getProfile();

      console.log("PROFILE DATA:", data);

      setProfile(data);

      // API-dən gələn role-u da yenilə
      if (data?.role) {
        setRole(data.role);
      }
    } catch (error) {
      console.error(
        "Failed to load profile",
        error
      );

      // Profile alınmasa belə role itməsin
      setRole(getRole());
    }
  };

  // =========================
  // AUTH / ACCOUNT CHANGE
  // =========================

  useEffect(() => {
    const refreshUserData = async () => {
      // Yeni hesabın role-unu dərhal götür
      const currentRole = getRole();

      setRole(currentRole);

      // // Köhnə profil qalmasın
      // setProfile(null);

      setOpenProfile(false);

      if (!isAuthenticated()) {
        setUnreadCount(0);
        return;
      }

      await loadProfile();
      await loadUnreadCount();
    };

    refreshUserData();

    // Login / logout zamanı
    const handleAuthChanged = () => {
      refreshUserData();
    };

    window.addEventListener(
      "authChanged",
      handleAuthChanged
    );

    return () => {
      window.removeEventListener(
        "authChanged",
        handleAuthChanged
      );
    };
  }, [location.pathname]);

  // =========================
  // SIGNALR
  // =========================

  useEffect(() => {
    if (!isAuthenticated()) {
      return;
    }

    const unsubscribeUnreadCount =
      onUnreadCountChanged((count) => {
        setUnreadCount(count);
      });

    const unsubscribeMessage =
      onReceiveMessage(() => {
        loadUnreadCount();
      });

    const unsubscribeRead =
      onMessagesRead(() => {
        loadUnreadCount();
      });

    return () => {
      unsubscribeUnreadCount?.();
      unsubscribeMessage?.();
      unsubscribeRead?.();
    };
  }, [role]);

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    logout();

    // Navbar-a hesabın dəyişdiyini bildir
    window.dispatchEvent(
      new Event("authChanged")
    );

    setProfile(null);
    setRole(null);
    setUnreadCount(0);
    setOpenProfile(false);

    navigate("/login");
  };

  // =========================
  // NAVBAR
  // =========================

  return (
    <nav className="relative z-50 bg-blue-600 text-white shadow-md">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* =========================
            LOGO
        ========================= */}

        <Link
          to="/"
          className="text-3xl font-bold transition hover:text-blue-100"
        >
          Homigo
        </Link>


        <div className="flex items-center gap-6">

          {/* =========================
              NOT AUTHENTICATED
          ========================= */}

          {!isAuthenticated() ? (

            <>

              <Link
                to="/"
                className="font-semibold transition hover:text-blue-100"
              >
                Home
              </Link>


              <Link
                to="/categories"
                className="font-semibold transition hover:text-blue-100"
              >
                Categories
              </Link>


              <Link
                to="/services"
                className="font-semibold transition hover:text-blue-100"
              >
                Services
              </Link>


              <Link
                to="/become-provider"
                className="rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-black transition hover:bg-yellow-300"
              >
                Become Provider
              </Link>


              <Link
                to="/login"
                className="font-semibold transition hover:text-blue-100"
              >
                Login
              </Link>


              <Link
                to="/register"
                className="font-semibold transition hover:text-blue-100"
              >
                Register
              </Link>

            </>

          ) : (

            <>

              {/* =========================
                  COMMON
              ========================= */}

              <Link
                to="/"
                className="font-semibold transition hover:text-blue-100"
              >
                Home
              </Link>


              {/* =========================
                  CUSTOMER
              ========================= */}

              {role === "Customer" && (

                <>

                  <Link
                    to="/services"
                    className="font-semibold transition hover:text-blue-100"
                  >
                    Services
                  </Link>


                  <Link
                    to="/become-provider"
                    className="rounded-lg bg-yellow-400 px-4 py-2 font-semibold text-black transition hover:bg-yellow-300"
                  >
                    Become Provider
                  </Link>


                  <Link
                    to="/addresses"
                    className="font-semibold transition hover:text-blue-100"
                  >
                    Addresses
                  </Link>


                  <Link
                    to="/my-orders"
                    className="relative font-semibold transition hover:text-blue-100"
                  >
                    My Orders

                    {unreadCount > 0 && (

                      <span className="absolute -right-4 -top-3 flex min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-bold text-white">

                        {unreadCount > 99
                          ? "99+"
                          : unreadCount}

                      </span>

                    )}

                  </Link>


                  <Link
                    to="/favorites"
                    className="font-semibold transition hover:text-blue-100"
                  >
                    Favorites
                  </Link>


                  <Link
                    to="/my-payments"
                    className="font-semibold transition hover:text-blue-100"
                  >
                    My Payments
                  </Link>

                </>

              )}


              {/* =========================
                  PROVIDER
              ========================= */}

              {role === "Provider" && (

                <>

                  <Link
                    to="/provider/services"
                    className="font-semibold transition hover:text-blue-100"
                  >
                    My Services
                  </Link>


                  <Link
                    to="/provider/orders"
                    className="relative font-semibold transition hover:text-blue-100"
                  >
                    My Jobs

                    {unreadCount > 0 && (

                      <span className="absolute -right-4 -top-3 flex min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-bold text-white">

                        {unreadCount > 99
                          ? "99+"
                          : unreadCount}

                      </span>

                    )}

                  </Link>


                  <Link
                    to="/provider/availability"
                    className="font-semibold transition hover:text-blue-100"
                  >
                    Availability
                  </Link>

                </>

              )}


              {/* =========================
                  ADMIN
              ========================= */}

              {role === "Admin" && (

                <Link
                  to="/admin/provider-applications"
                  className="font-semibold transition hover:text-blue-100"
                >
                  Pending Applications
                </Link>

              )}


              {/* =========================
                  PROFILE
              ========================= */}

              <div className="relative">

                {/* PROFILE BUTTON */}

                <button
                  onClick={() =>
                    setOpenProfile(!openProfile)
                  }
                  className="flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-white/10"
                >

                  {/* PROFILE IMAGE */}

                  {profile?.profileImageUrl ? (

                    <img
                      src={`https://localhost:7121${profile.profileImageUrl}`}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-white/80"
                      alt="Profile"
                    />

                  ) : (

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white font-bold text-blue-600 shadow-sm">
                      {profile?.fullName
                        ? profile.fullName
                            .charAt(0)
                            .toUpperCase()
                        : "U"}
                    </div>

                  )}


                  {/* NAME + ROLE */}

                  <div className="hidden text-left md:block">

                    <p className="font-semibold">
                      {profile?.fullName || "User"}
                    </p>

                    <p className="text-xs text-blue-100">
                      {profile?.role || role}
                    </p>

                  </div>


                  {/* ARROW */}

                  <span
                    className={`text-xs transition-transform ${
                      openProfile
                        ? "rotate-180"
                        : ""
                    }`}
                  >
                    ▼
                  </span>

                </button>


                {/* =========================
                    PROFILE DROPDOWN
                ========================= */}

                {openProfile && (

                  <div className="absolute right-0 top-full z-[100] mt-3 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white text-black shadow-xl">

                    {/* PROFILE HEADER */}

                    <div className="bg-slate-50 px-4 py-4">

                      <div className="flex items-center gap-3">

                        {profile?.profileImageUrl ? (

                          <img
                            src={`https://localhost:7121${profile.profileImageUrl}`}
                            alt="Profile"
                            className="h-11 w-11 rounded-full object-cover shadow-sm"
                          />

                        ) : (

                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-bold text-white shadow-sm">
                            {profile?.fullName
                              ? profile.fullName
                                  .charAt(0)
                                  .toUpperCase()
                              : "U"}
                          </div>

                        )}


                        <div className="min-w-0">

                          <p className="truncate font-bold text-slate-900">
                            {profile?.fullName || "User"}
                          </p>

                          <p className="mt-0.5 text-xs font-medium text-slate-500">
                            {profile?.role || role}
                          </p>

                        </div>

                      </div>

                    </div>


                    {/* MENU */}

                    <div className="p-2">

                      {/* PROFILE */}

                      <Link
                        to="/profile"
                        onClick={() =>
                          setOpenProfile(false)
                        }
                        className="group flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-blue-50"
                      >

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-base transition group-hover:bg-blue-100">
                          👤
                        </div>

                        <div className="flex-1">

                          <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-600">
                            Profile
                          </p>

                          <p className="text-xs text-slate-400">
                            View your profile
                          </p>

                        </div>

                        <span className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-500">
                          →
                        </span>

                      </Link>


                      {/* LOGOUT */}

                      <button
                        onClick={handleLogout}
                        className="group mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-red-50"
                      >

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-base transition group-hover:bg-red-100">
                          ↪
                        </div>

                        <div className="flex-1">

                          <p className="text-sm font-semibold text-slate-700 group-hover:text-red-600">
                            Logout
                          </p>

                          <p className="text-xs text-slate-400">
                            Sign out of your account
                          </p>

                        </div>

                      </button>

                    </div>

                  </div>

                )}

              </div>

            </>

          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;