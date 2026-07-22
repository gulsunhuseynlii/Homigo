import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  FaTags,
  FaTools,
  FaUserCheck,
  FaClipboardList,
} from "react-icons/fa";

import AdminCard from "../../components/admin/AdminCard";
import StatCard from "../../components/admin/StatCard";

import { getDashboardStats } from "../../services/adminService";

function AdminHome() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch {
      toast.error("Failed to load dashboard.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="text-5xl font-extrabold text-slate-800">
          Welcome back, Admin 👋
        </h1>

        <p className="mt-4 text-xl text-slate-500">
          Manage Homigo platform from one place.
        </p>

        {/* Statistics */}

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-5">

          <StatCard
            title="Users"
            value={stats?.totalUsers ?? 0}
            color="#2563eb"
          />

          <StatCard
            title="Providers"
            value={stats?.totalProviders ?? 0}
            color="#16a34a"
          />

          <StatCard
            title="Orders"
            value={stats?.totalOrders ?? 0}
            color="#ea580c"
          />

          <StatCard
            title="Pending"
            value={stats?.pendingOrders ?? 0}
            color="#eab308"
          />

          <StatCard
            title="Revenue"
            value={`${stats?.totalRevenue ?? 0} ₼`}
            color="#7c3aed"
          />

        </div>

        <h2 className="mt-16 mb-8 text-3xl font-bold">
          Quick Actions
        </h2>

        <div className="grid gap-8 md:grid-cols-2">

          <AdminCard
            title="Categories"
            description="Create, update and delete categories."
            icon={<FaTags className="text-blue-600" />}
            onClick={() => navigate("/admin/categories")}
          />

          <AdminCard
            title="Services"
            description="Manage all services."
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
            description="Manage all customer orders."
            icon={<FaClipboardList className="text-purple-600" />}
            onClick={() => navigate("/admin/orders")}
          />

        </div>
      </div>
    </div>
  );
}

export default AdminHome;