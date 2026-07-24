import { Navigate } from "react-router-dom";
import { isAuthenticated, getRole } from "../utils/auth";

function ProtectedRoute({ children, roles }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(getRole())) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;