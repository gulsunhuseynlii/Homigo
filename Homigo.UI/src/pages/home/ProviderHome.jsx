import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Spinner from "../../components/common/Spinner";
import { getMyServices } from "../../services/providerService";
import { getMyProviderOrders } from "../../services/orderService";
import {
  startConnection,
  onReceiveNotification,
} from "../../services/notificationService";

function ProviderHome() {
  const [services, setServices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  loadData();

  startConnection();

  onReceiveNotification(() => {
    loadData();
  });
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
    setOrders(ordersData.items);
  } catch {
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

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">

      <div className="mb-10">
        <h1 className="text-5xl font-bold">
          Provider Dashboard
        </h1>

        <p className="mt-2 text-slate-500">
          Welcome back!
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-slate-500">
            My Services
          </p>

          <h2 className="mt-3 text-4xl font-bold text-blue-600">
            {services.length}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-slate-500">
            Pending Orders
          </p>

          <h2 className="mt-3 text-4xl font-bold text-yellow-500">
            {pendingOrders}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-slate-500">
            Active Orders
          </p>

          <h2 className="mt-3 text-4xl font-bold text-green-600">
            {activeOrders}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-slate-500">
            Completed Orders
          </p>

          <h2 className="mt-3 text-4xl font-bold text-purple-600">
            {completedOrders}
          </h2>
        </div>

      </div>

      <div className="mt-12 rounded-2xl bg-white p-8 shadow">

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-2xl font-bold">
            Recent Orders
          </h2>

          <Link
            to="/provider/jobs"
            className="text-blue-600 hover:underline"
          >
            View All
          </Link>

        </div>

  {orders.length === 0 ? (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
    <div className="mb-4 text-6xl">🛠️</div>

    <h2 className="text-2xl font-bold text-slate-800">
      No jobs yet
    </h2>

    <p className="mt-2 text-slate-500">
      New customer bookings will appear here once they choose your services.
    </p>

    <Link
      to="/provider/services"
      className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
    >
      Manage My Services
    </Link>
  </div>
) : (
          <div className="space-y-4">

            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-xl border p-5"
              >

                <div>
                  <h3 className="font-semibold">
                    {order.serviceName}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {order.customerName}
                  </p>
                </div>

                <span className="rounded-full bg-blue-100 px-4 py-2 text-sm text-blue-700">
                  {order.status}
                </span>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default ProviderHome;