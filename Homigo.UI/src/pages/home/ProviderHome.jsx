import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Spinner from "../../components/common/Spinner";

import { getMyServices } from "../../services/providerService";
import { getMyProviderOrders } from "../../services/orderService";

import {
  startConnection,
  onReceiveNotification,
  stopConnection,
} from "../../services/notificationService";

function ProviderHome() {
  const [services, setServices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  loadData();

  startConnection();

  const unsubscribe = onReceiveNotification(() => {
    loadData();
  });

  return () => {
    unsubscribe();
    stopConnection();
  };
}, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [servicesData, ordersData] = await Promise.all([
        getMyServices(),
        getMyProviderOrders({
          page: 1,
          pageSize: 5,
        }),
      ]);

      setServices(servicesData);
      setOrders(ordersData.items ?? ordersData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  const pendingOrders = orders.filter(
    (x) => x.status === "Pending"
  ).length;

  const activeOrders = orders.filter(
    (x) =>
      x.status === "Accepted" ||
      x.status === "InProgress"
  ).length;

  const completedOrders = orders.filter(
    (x) => x.status === "Completed"
  ).length;

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Accepted":
        return "bg-blue-100 text-blue-700";

      case "InProgress":
        return "bg-purple-100 text-purple-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500">

        <div className="mx-auto max-w-7xl px-6 py-14">

          <div className="grid items-center gap-10 lg:grid-cols-2">

            {/* LEFT */}

            <div className="text-white">

              <span className="inline-flex rounded-full bg-blue-800/60 px-4 py-2 text-sm font-semibold">
                Homigo Provider
              </span>

              <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">
                Welcome back! 👋
              </h1>

              <p className="mt-4 max-w-xl text-lg leading-8 text-blue-100">
                Manage your services, keep track of customer
                bookings and grow your business with Homigo.
              </p>

              {/* ACTIONS */}

              <div className="mt-8 flex flex-wrap gap-4">

                <Link
                  to="/provider/services"
                  className="rounded-xl bg-white px-6 py-3 font-semibold text-blue-700 shadow-lg transition hover:bg-blue-50"
                >
                  Manage Services
                </Link>

                <Link
                  to="/provider/jobs"
                  className="rounded-xl border border-white/40 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20"
                >
                  View My Jobs
                </Link>

              </div>

              {/* MINI STATS */}

              <div className="mt-9 flex flex-wrap gap-10">

                <div>
                  <p className="text-3xl font-extrabold">
                    {services.length}
                  </p>

                  <p className="text-sm text-blue-100">
                    My Services
                  </p>
                </div>

                <div>
                  <p className="text-3xl font-extrabold">
                    {pendingOrders}
                  </p>

                  <p className="text-sm text-blue-100">
                    Pending Jobs
                  </p>
                </div>

                <div>
                  <p className="text-3xl font-extrabold">
                    {completedOrders}
                  </p>

                  <p className="text-sm text-blue-100">
                    Completed
                  </p>
                </div>

              </div>

            </div>


            {/* RIGHT */}

            <div className="hidden justify-center lg:flex">

              <div className="flex h-80 w-80 items-center justify-center rounded-3xl bg-white/10 backdrop-blur-sm">

                <div className="flex h-60 w-60 flex-col items-center justify-center rounded-3xl bg-white/10 text-center">

                  <div className="text-7xl">
                    🛠️
                  </div>

                  <p className="mt-5 text-xl font-bold text-white">
                    Your business,
                  </p>

                  <p className="mt-1 text-blue-100">
                    your services, your customers.
                  </p>

                </div>

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
            STAT CARDS
        ===================================================== */}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* SERVICES */}

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md">

            <div className="flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl">
                🧰
              </div>

              <span className="text-sm font-semibold text-blue-600">
                Services
              </span>

            </div>

            <p className="mt-5 text-sm text-slate-500">
              My Services
            </p>

            <p className="mt-1 text-3xl font-extrabold text-slate-900">
              {services.length}
            </p>

          </div>


          {/* PENDING */}

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md">

            <div className="flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-xl">
                ⏳
              </div>

              <span className="text-sm font-semibold text-yellow-600">
                Pending
              </span>

            </div>

            <p className="mt-5 text-sm text-slate-500">
              Pending Orders
            </p>

            <p className="mt-1 text-3xl font-extrabold text-slate-900">
              {pendingOrders}
            </p>

          </div>


          {/* ACTIVE */}

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md">

            <div className="flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-xl">
                ⚡
              </div>

              <span className="text-sm font-semibold text-purple-600">
                Active
              </span>

            </div>

            <p className="mt-5 text-sm text-slate-500">
              Active Orders
            </p>

            <p className="mt-1 text-3xl font-extrabold text-slate-900">
              {activeOrders}
            </p>

          </div>


          {/* COMPLETED */}

          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-md">

            <div className="flex items-center justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-xl">
                ✓
              </div>

              <span className="text-sm font-semibold text-green-600">
                Done
              </span>

            </div>

            <p className="mt-5 text-sm text-slate-500">
              Completed Orders
            </p>

            <p className="mt-1 text-3xl font-extrabold text-slate-900">
              {completedOrders}
            </p>

          </div>

        </div>


        {/* =====================================================
            QUICK ACTIONS
        ===================================================== */}

        <section className="mt-14">

          <div className="mb-6">

            <h2 className="text-2xl font-bold text-slate-900">
              Quick Actions
            </h2>

            <p className="mt-1 text-slate-500">
              Manage your Homigo business quickly.
            </p>

          </div>

          <div className="grid gap-4 md:grid-cols-2">

            <Link
              to="/provider/services"
              className="group flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl">
                  🧰
                </div>

                <div>

                  <h3 className="font-bold text-slate-900">
                    Manage My Services
                  </h3>

                  <p className="text-sm text-slate-500">
                    Add or manage the services you offer
                  </p>

                </div>

              </div>

              <span className="text-xl text-blue-600 transition group-hover:translate-x-1">
                →
              </span>

            </Link>


            <Link
              to="/provider/jobs"
              className="group flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-lg"
            >

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-xl">
                  📋
                </div>

                <div>

                  <h3 className="font-bold text-slate-900">
                    Manage My Jobs
                  </h3>

                  <p className="text-sm text-slate-500">
                    View and manage customer bookings
                  </p>

                </div>

              </div>

              <span className="text-xl text-green-600 transition group-hover:translate-x-1">
                →
              </span>

            </Link>

          </div>

        </section>


        {/* =====================================================
            RECENT ORDERS
        ===================================================== */}

        <section className="mt-14">

          <div className="mb-7 flex items-center justify-between">

            <div>

              <h2 className="text-3xl font-bold text-slate-900">
                Recent Orders
              </h2>

              <p className="mt-1 text-slate-500">
                Keep track of your latest customer bookings.
              </p>

            </div>

            <Link
              to="/provider/jobs"
              className="font-semibold text-blue-600 transition hover:text-blue-700"
            >
              View All →
            </Link>

          </div>


          {orders.length === 0 ? (

            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                🛠️
              </div>

              <h2 className="mt-5 text-2xl font-bold text-slate-900">
                No jobs yet
              </h2>

              <p className="mx-auto mt-2 max-w-lg text-slate-500">
                New customer bookings will appear here once
                customers choose your services.
              </p>

              <Link
                to="/provider/services"
                className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Manage My Services
              </Link>

            </div>

          ) : (

            <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">

              {orders.slice(0, 5).map((order, index) => (

                <div
                  key={order.id}
                  className={`flex flex-col gap-4 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between ${
                    index !== orders.slice(0, 5).length - 1
                      ? "border-b border-slate-100"
                      : ""
                  }`}
                >

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-xl">
                      📋
                    </div>

                    <div>

                      <h3 className="font-bold text-slate-900">
                        {order.serviceName}
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Customer: {order.customerName}
                      </p>

                    </div>

                  </div>


                  <div className="flex items-center gap-4">

                    {order.scheduledDate && (
                      <span className="hidden text-sm text-slate-500 md:block">
                        {new Date(
                          order.scheduledDate
                        ).toLocaleDateString()}
                      </span>
                    )}

                    <span
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </div>

    </div>
  );
}

export default ProviderHome;