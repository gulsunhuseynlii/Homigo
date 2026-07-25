import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getCategories } from "../../services/categoryService";
import { getMyOrders } from "../../services/orderService";
import CategoryCard from "../../components/category/CategoryCard";

function CustomerHome() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoriesData, ordersData] =
        await Promise.all([
          getCategories(),
          getMyOrders(),
        ]);

      setCategories(categoriesData);
      setOrders(ordersData);
    } catch {
      toast.error("Failed to load dashboard.");
    }
  };

  const pendingOrders = orders.filter(
    (x) => x.status === "Pending"
  ).length;

  const completedOrders = orders.filter(
    (x) => x.status === "Completed"
  ).length;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">

      {/* Header */}

      <div className="mb-10">

        <h1 className="text-5xl font-bold">
          Welcome back 👋
        </h1>

        <p className="mt-3 text-lg text-slate-500">
          Ready to book your next home service?
        </p>

      </div>

      {/* Stats */}

      <div className="grid gap-6 md:grid-cols-3">

        <div className="rounded-2xl bg-white p-6 shadow">

          <p className="text-slate-500">
            My Orders
          </p>

          <h2 className="mt-3 text-4xl font-bold text-blue-600">
            {orders.length}
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
            Completed Orders
          </p>

          <h2 className="mt-3 text-4xl font-bold text-green-600">
            {completedOrders}
          </h2>

        </div>

      </div>

      {/* Quick Actions */}

      <div className="mt-12">

        <h2 className="mb-5 text-2xl font-bold">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-4">

          <button
            onClick={() => navigate("/my-orders")}
            className="rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            My Orders
          </button>

          <button
            onClick={() => navigate("/favorites")}
            className="rounded-xl bg-pink-600 px-6 py-3 text-white hover:bg-pink-700"
          >
            Favorites
          </button>

        </div>

      </div>

      {/* Categories */}

      <div className="mt-14">

        <div className="mb-8 flex items-center justify-between">

          <h2 className="text-3xl font-bold">
            Popular Categories
          </h2>

          <button
            onClick={() => navigate("/categories")}
            className="text-blue-600 hover:underline"
          >
            View All
          </button>

        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {categories.map((category) => (

            <CategoryCard
              key={category.id}
              category={category}
              onClick={() =>
                navigate(
                  `/services?categoryId=${category.id}`
                )
              }
            />

          ))}

        </div>

      </div>

      {/* Recent Orders */}

      <div className="mt-14">

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-3xl font-bold">
            Recent Orders
          </h2>

          <button
            onClick={() => navigate("/my-orders")}
            className="text-blue-600 hover:underline"
          >
            View All
          </button>

        </div>

        {orders.length === 0 ? (
          <div className="rounded-2xl bg-slate-100 py-12 text-center text-slate-500">
            No orders yet.
          </div>
        ) : (
          <div className="space-y-4">

            {orders.slice(0, 5).map((order) => (

              <div
                key={order.id}
                className="flex items-center justify-between rounded-xl border bg-white p-5 shadow-sm"
              >

                <div>

                  <h3 className="font-semibold">
                    {order.serviceName}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {new Date(
                      order.scheduledDate
                    ).toLocaleDateString()}
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

export default CustomerHome;