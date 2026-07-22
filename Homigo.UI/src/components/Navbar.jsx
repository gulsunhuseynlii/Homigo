import { Link, useNavigate } from "react-router-dom";
import {
  isAuthenticated,
  logout,
  getRole,
} from "../utils/auth";

function Navbar() {
  const navigate = useNavigate();

  const role = getRole();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white px-8 py-4 shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link
          to="/"
          className="text-3xl font-bold transition hover:text-blue-100"
        >
          Homigo
        </Link>

        <div className="flex items-center gap-6">
          {!isAuthenticated() ? (
            <>
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
              {/* Home */}
              <Link
                to="/"
                className="font-semibold transition hover:text-blue-100"
              >
                Home
              </Link>

              {/* Customer */}
              {role === "Customer" && (
                <>
                  <Link
                    to="/services"
                    className="font-semibold transition hover:text-blue-100"
                  >
                    Services
                  </Link>

                  <Link
                    to="/addresses"
                    className="font-semibold transition hover:text-blue-100"
                  >
                    Addresses
                  </Link>

                  <Link
                    to="/my-orders"
                    className="font-semibold transition hover:text-blue-100"
                  >
                    My Orders
                  </Link>

                  <Link
                    to="/favorites"
                    className="font-semibold transition hover:text-blue-100"
                  >
                    Favorites
                  </Link>
                </>
              )}

              {/* Provider */}
              {role === "Provider" && (
                <Link
                  to="/provider/orders"
                  className="font-semibold transition hover:text-blue-100"
                >
                  My Jobs
                </Link>
              )}

              {/* Admin */}
              {role === "Admin" && (
                <Link
                  to="/admin"
                  className="font-semibold transition hover:text-blue-100"
                >
                  Dashboard
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="rounded-lg bg-white px-4 py-2 font-semibold text-blue-600 transition hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;