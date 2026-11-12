import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Spinner from "../../components/common/Spinner";

import { getCategories } from "../../services/categoryService";
import { getMyOrders } from "../../services/orderService";
import { getServices } from "../../services/serviceService";

import CategoryCard from "../../components/category/CategoryCard";
import AiAssistant from "../../components/ai/AiAssistant";

function CustomerHome() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [
        categoriesData,
        ordersData,
        servicesData,
      ] = await Promise.all([
        getCategories(),

        getMyOrders({
          page: 1,
          pageSize: 5,
        }),

        getServices(),
      ]);

      setCategories(categoriesData);

      setOrders(
        ordersData.items ?? ordersData
      );

      setServices(
        servicesData.items
          ? servicesData.items.slice(0, 3)
          : servicesData.slice(0, 3)
      );

    } catch (error) {
      console.error(
        "CUSTOMER HOME ERROR:",
        error
      );

      toast.error(
        "Failed to load dashboard."
      );

    } finally {
      setLoading(false);
    }
  };

  const pendingOrders = orders.filter(
    (order) =>
      order.status === "Pending"
  ).length;

  const completedOrders = orders.filter(
    (order) =>
      order.status === "Completed"
  ).length;

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      case "Accepted":
        return "bg-blue-100 text-blue-700";

      case "InProgress":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500">

        <div className="mx-auto max-w-7xl px-6 py-14 lg:py-16">

          <div className="grid items-center gap-10 lg:grid-cols-2">

            {/* LEFT SIDE */}

            <div className="text-white">

              <span className="inline-flex rounded-full bg-blue-800/60 px-4 py-2 text-sm font-semibold">
                Trusted Home Services
              </span>

              <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl">
                Find Trusted
                <br />
                Home Services
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-blue-100">
                Discover trusted professionals for
                cleaning, plumbing, electrical work,
                transportation, beauty services and
                much more.
              </p>

              {/* STATS */}

              <div className="mt-8 flex flex-wrap gap-8 sm:gap-10">

                <div>
                  <div className="text-3xl font-bold">
                    {categories.length}+
                  </div>

                  <div className="text-sm text-blue-100">
                    Categories
                  </div>
                </div>

                <div>
                  <div className="text-3xl font-bold">
                    500+
                  </div>

                  <div className="text-sm text-blue-100">
                    Providers
                  </div>
                </div>

                <div>
                  <div className="text-3xl font-bold">
                    2000+
                  </div>

                  <div className="text-sm text-blue-100">
                    Completed Orders
                  </div>
                </div>

              </div>

            </div>

            {/* RIGHT SIDE */}

            <div className="hidden lg:flex lg:justify-center">

              <div className="flex h-[400px] w-[370px] items-center justify-center rounded-3xl bg-white/10 shadow-inner backdrop-blur-sm">

                <div className="text-[120px]">
                  🏠
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="mx-auto max-w-7xl px-6 py-12">

        {/* =====================================================
            QUICK STATS
        ===================================================== */}

        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {/* TOTAL ORDERS */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  My Orders
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {orders.length}
                </p>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                📋
              </div>

            </div>

          </div>


          {/* PENDING */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Pending Orders
                </p>

                <p className="mt-2 text-3xl font-bold text-yellow-600">
                  {pendingOrders}
                </p>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-2xl">
                ⏳
              </div>

            </div>

          </div>


          {/* COMPLETED */}

          <div className="rounded-2xl bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm font-medium text-slate-500">
                  Completed Orders
                </p>

                <p className="mt-2 text-3xl font-bold text-green-600">
                  {completedOrders}
                </p>

              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
                ✅
              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            CATEGORIES
        ===================================================== */}

        <section className="mt-14">

          <div className="mb-6 flex items-center justify-between">

            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                Browse Categories
              </h2>

              <p className="mt-1 text-slate-500">
                Find the right service for your needs.
              </p>

            </div>

            <button
              onClick={() =>
                navigate("/categories")
              }
              className="font-semibold text-blue-600 transition hover:text-blue-700"
            >
              View all →
            </button>

          </div>


          {categories.length === 0 ? (

            <div className="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm">
              No categories available.
            </div>

          ) : (

            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">

              {categories
                .slice(0, 8)
                .map((category) => (

                  <CategoryCard
                    key={category.id}
                    category={category}
                  />

                ))}

            </div>

          )}

        </section>


        {/* =====================================================
            POPULAR SERVICES
        ===================================================== */}

        <section className="mt-14">

          <div className="mb-6 flex items-center justify-between">

            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                Popular Services
              </h2>

              <p className="mt-1 text-slate-500">
                Explore services from trusted providers.
              </p>

            </div>

            <button
              onClick={() =>
                navigate("/services")
              }
              className="font-semibold text-blue-600 transition hover:text-blue-700"
            >
              View all →
            </button>

          </div>


          {services.length === 0 ? (

            <div className="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm">
              No services available.
            </div>

          ) : (

            <div className="grid gap-6 md:grid-cols-3">

              {services.map((service) => (

                <div
                  key={service.id}
                  className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >

                  {/* IMAGE */}

                  <div className="flex h-48 items-center justify-center bg-slate-100">

                    {service.imageUrl ? (

                      <img
                        src={
                          service.imageUrl.startsWith("http")
                            ? service.imageUrl
                            : `https://localhost:7121${service.imageUrl}`
                        }
                        alt={service.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";
                        }}
                      />

                    ) : (

                      <div className="text-6xl">
                        🛠️
                      </div>

                    )}

                  </div>


                  {/* CONTENT */}

                  <div className="p-5">

                    <h3 className="line-clamp-1 text-xl font-bold text-slate-900">
                      {service.name}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                      {service.description}
                    </p>


                    <div className="mt-5 flex items-center justify-between">

                      <div>

                        <p className="text-xs uppercase tracking-wide text-slate-400">
                          Starting from
                        </p>

                        <p className="text-2xl font-extrabold text-blue-600">
                          {service.basePrice} ₼
                        </p>

                      </div>

                      {service.estimatedMinutes && (

                        <div className="rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600">
                          ⏱ {service.estimatedMinutes} min
                        </div>

                      )}

                    </div>


                    <button
                      onClick={() =>
                        navigate(
                          `/services/${service.id}`
                        )
                      }
                      className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                      View Service
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>


        {/* =====================================================
            RECENT ORDERS
        ===================================================== */}

        <section className="mt-14">

          <div className="mb-6 flex items-center justify-between">

            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                Recent Orders
              </h2>

              <p className="mt-1 text-slate-500">
                Keep track of your latest service requests.
              </p>

            </div>

            <button
              onClick={() =>
                navigate("/my-orders")
              }
              className="font-semibold text-blue-600 transition hover:text-blue-700"
            >
              View all →
            </button>

          </div>


          {orders.length === 0 ? (

            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">

              <div className="text-5xl">
                📋
              </div>

              <h3 className="mt-4 text-xl font-bold text-slate-800">
                No orders yet
              </h3>

              <p className="mt-2 text-slate-500">
                Find a service and make your first booking.
              </p>

              <button
                onClick={() =>
                  navigate("/services")
                }
                className="mt-5 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Browse Services
              </button>

            </div>

          ) : (

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

              <div className="divide-y divide-slate-100">

                {orders
                  .slice(0, 5)
                  .map((order) => (

                    <div
                      key={order.id}
                      className="flex flex-col gap-4 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                    >

                      <div>

                        <h3 className="font-bold text-slate-900">
                          {order.serviceName}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {order.scheduledDate
                            ? new Date(
                                order.scheduledDate
                              ).toLocaleString()
                            : "Date not available"}
                        </p>

                      </div>


                      <div className="flex items-center gap-4">

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

            </div>

          )}

        </section>

      </main>


      {/* =====================================================
          AI ASSISTANT
      ===================================================== */}

      <AiAssistant />

    </div>
  );
}

export default CustomerHome;