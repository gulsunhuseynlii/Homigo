import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  FaTags,
  FaTools,
  FaUserCheck,
  FaClipboardList,
  FaUsers,
  FaShoppingBag,
  FaMoneyBillWave,
  FaClock,
  FaArrowRight,
} from "react-icons/fa";

import { getDashboardStats } from "../../services/adminService";

function AdminHome() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const data = await getDashboardStats();

      setStats(data);
    } catch {
      toast.error("Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: <FaUsers />,
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Providers",
      value: stats?.totalProviders ?? 0,
      icon: <FaUserCheck />,
      bg: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders ?? 0,
      icon: <FaShoppingBag />,
      bg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
    {
      title: "Pending Orders",
      value: stats?.pendingOrders ?? 0,
      icon: <FaClock />,
      bg: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
    {
      title: "Revenue",
      value: `${stats?.totalRevenue ?? 0} $`,
      icon: <FaMoneyBillWave />,
      bg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
  ];

  const actions = [
    {
      title: "Categories",
      description:
        "Create, update and organize service categories.",
      icon: <FaTags />,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      path: "/admin/categories",
    },
    {
      title: "Services",
      description:
        "Manage all services available on Homigo.",
      icon: <FaTools />,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
      path: "/admin/services",
    },
    {
      title: "Providers",
      description:
        "View and manage approved service providers.",
      icon: <FaUserCheck />,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-100",
      path: "/admin/providers",
    },
    {
      title: "Orders",
      description:
        "Monitor and manage customer orders.",
      icon: <FaClipboardList />,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
      path: "/admin/orders",
    },
    {
      title: "Provider Applications",
      description:
        "Review and approve new provider applications.",
      icon: <FaUserCheck />,
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-100",
      path: "/admin/provider-applications",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500">

        <div className="mx-auto max-w-7xl px-6 py-14">

          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">

            <div className="text-white">

              <span className="inline-flex rounded-full bg-blue-800/60 px-4 py-2 text-sm font-semibold">
                Homigo Administration
              </span>

              <h1 className="mt-5 text-4xl font-extrabold sm:text-5xl">
                Welcome back, Admin 👋
              </h1>

              <p className="mt-4 max-w-2xl text-lg leading-8 text-blue-100">
                Manage users, providers, services and orders
                from one place.
              </p>

            </div>


            {/* HERO ICON */}

            <div className="hidden lg:flex">

              <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-white/10 text-6xl text-white backdrop-blur-sm">
                ⚙️
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="mx-auto max-w-7xl px-6 py-12">


        {/* =====================================================
            STATISTICS
        ===================================================== */}

        <section>

          <div className="mb-7">

            <h2 className="text-2xl font-bold text-slate-900">
              Platform Overview
            </h2>

            <p className="mt-1 text-slate-500">
              A quick overview of your Homigo platform.
            </p>

          </div>


          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

            {statCards.map((stat) => (

              <div
                key={stat.title}
                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
              >

                <div className="flex items-center justify-between">

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl ${stat.bg} ${stat.iconColor}`}
                  >
                    {stat.icon}
                  </div>

                </div>

                <p className="mt-5 text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <p className="mt-1 text-3xl font-extrabold text-slate-900">
                  {loading ? "..." : stat.value}
                </p>

              </div>

            ))}

          </div>

        </section>


        {/* =====================================================
            QUICK ACTIONS
        ===================================================== */}

        <section className="mt-14">

          <div className="mb-7">

            <h2 className="text-3xl font-bold text-slate-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-slate-500">
              Quickly access the most important administration tools.
            </p>

          </div>


          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {actions.map((action) => (

              <button
                key={action.title}
                onClick={() => navigate(action.path)}
                className="group flex w-full items-center gap-5 rounded-2xl bg-white p-6 text-left shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
              >

                {/* ICON */}

                <div
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl ${action.iconBg} ${action.iconColor}`}
                >
                  {action.icon}
                </div>


                {/* TEXT */}

                <div className="min-w-0 flex-1">

                  <h3 className="text-lg font-bold text-slate-900">
                    {action.title}
                  </h3>

                  <p className="mt-1 text-sm leading-5 text-slate-500">
                    {action.description}
                  </p>

                </div>


                {/* ARROW */}

                <FaArrowRight
                  className={`shrink-0 text-slate-300 transition group-hover:translate-x-1 ${action.iconColor}`}
                />

              </button>

            ))}

          </div>

        </section>


        {/* =====================================================
            ADMIN INFO
        ===================================================== */}

        <section className="mt-14">

          <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white shadow-lg">

            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

              <div>

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                    ⚡
                  </div>

                  <h2 className="text-2xl font-bold">
                    Homigo Administration
                  </h2>

                </div>

                <p className="mt-3 max-w-2xl text-slate-300">
                  Keep the platform organized by managing
                  categories, services, providers and customer
                  orders.
                </p>

              </div>


              <button
                onClick={() =>
                  navigate("/admin/provider-applications")
                }
                className="shrink-0 rounded-xl bg-white px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Review Applications →
              </button>

            </div>

          </div>

        </section>

      </div>

    </div>
  );
}

export default AdminHome;