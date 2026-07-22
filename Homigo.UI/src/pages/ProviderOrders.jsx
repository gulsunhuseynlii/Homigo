import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import ProviderOrderCard from "../components/provider/ProviderOrderCard";

import {
  getMyJobs,
  acceptOrder,
  startOrder,
  completeOrder,
} from "../services/providerOrderService";

function ProviderOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getMyJobs();

      setOrders(data);
    } catch {
      toast.error("Failed to load jobs.");
    }
  };

  const handleAccept = async (id) => {
    try {
      await acceptOrder(id);

      toast.success("Order accepted.");

      loadOrders();
    } catch {
      toast.error("Failed to accept order.");
    }
  };

  const handleStart = async (id) => {
    try {
      await startOrder(id);

      toast.success("Order started.");

      loadOrders();
    } catch {
      toast.error("Failed to start order.");
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeOrder(id);

      toast.success("Order completed.");

      loadOrders();
    } catch {
      toast.error("Failed to complete order.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">

      <h1 className="mb-8 text-4xl font-bold">
        My Jobs
      </h1>

      {orders.length === 0 ? (

        <div className="rounded-2xl bg-slate-100 p-10 text-center">

          <h2 className="text-2xl font-semibold">
            No jobs yet.
          </h2>

        </div>

      ) : (

        <div className="space-y-6">

          {orders.map((order) => (
            <ProviderOrderCard
              key={order.id}
              order={order}
              onAccept={handleAccept}
              onStart={handleStart}
              onComplete={handleComplete}
            />
          ))}

        </div>

      )}

    </div>
  );
}

export default ProviderOrders;