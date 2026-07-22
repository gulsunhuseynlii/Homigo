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
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="text-3xl font-bold hover:text-blue-100 transition"
        >
          Homigo
        </Link>

        <div className="flex items-center gap-6">
          {!isAuthenticated() ? (
            <>
              <Link
                to="/login"
                className="font-semibold hover:text-blue-100 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="font-semibold hover:text-blue-100 transition"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/"
                className="font-semibold hover:text-blue-100 transition"
              >
                Home
              </Link>

              {role === "Customer" && (
                <Link
                  to="/services"
                  className="font-semibold hover:text-blue-100 transition"
                >
                  Services
                </Link>
              )}

              {role === "Customer" && (
                <>
                  <Link
                    to="/addresses"
                    className="font-semibold hover:text-blue-100 transition"
                  >
                    Addresses
                  </Link>

                  <Link
                    to="/my-orders"
                    className="font-semibold hover:text-blue-100 transition"
                  >
                    My Orders
                  </Link>

                  <Link
                    to="/favorites"
                    className="font-semibold hover:text-blue-100 transition"
                  >
                    Favorites
                  </Link>
                </>
              )}

              {role === "Provider" && (
                <Link
                  to="/provider/orders"
                  className="font-semibold hover:text-blue-100 transition"
                >
                  My Jobs
                </Link>
              )}

              {role === "Admin" && (
                <>
                  <Link
                    to="/categories"
                    className="font-semibold hover:text-blue-100 transition"
                  >
                    Categories
                  </Link>

                  <Link
                    to="/providers"
                    className="font-semibold hover:text-blue-100 transition"
                  >
                    Providers
                  </Link>
                </>
              )}

              <button
                onClick={handleLogout}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
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