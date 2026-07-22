import { useNavigate } from "react-router-dom";
import {
  FaTags,
  FaTools,
  FaUserCheck,
  FaClipboardList,
} from "react-icons/fa";

import AdminCard from "../components/admin/AdminCard";

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">

      <div className="mb-12">

        <h1 className="text-5xl font-bold text-slate-800">
          Admin Dashboard
        </h1>

        <p className="mt-4 text-lg text-slate-500">
          Welcome back! Manage Homigo from one place.
        </p>

      </div>

      <div className="grid gap-8 md:grid-cols-2">

        <AdminCard
          title="Categories"
          description="Create, edit and manage categories."
          icon={<FaTags className="text-blue-600" />}
          onClick={() => navigate("/admin/categories")}
        />

        <AdminCard
          title="Services"
          description="Manage available services."
          icon={<FaTools className="text-green-600" />}
          onClick={() => navigate("/admin/services")}
        />

        <AdminCard
          title="Providers"
          description="Approve provider applications."
          icon={<FaUserCheck className="text-orange-500" />}
          onClick={() => navigate("/admin/providers")}
        />

        <AdminCard
          title="Orders"
          description="View and manage customer orders."
          icon={<FaClipboardList className="text-purple-600" />}
          onClick={() => navigate("/admin/orders")}
        />

      </div>

    </div>
  );
}

export default AdminDashboard;