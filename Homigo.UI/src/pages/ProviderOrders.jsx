import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Pagination from "../components/common/Pagination";
import Spinner from "../components/common/Spinner";
import ProviderOrderCard from "../components/provider/ProviderOrderCard";

import {
  getMyJobs,
  acceptOrder,
  rejectOrder,
  startOrder,
  completeOrder,
} from "../services/providerOrderService";

function ProviderOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
  loadOrders();
}, [page]);

  const loadOrders = async () => {
  try {
    setLoading(true);

    const data = await getMyJobs({
      page,
      pageSize: 5,
    });

    setOrders(data.items);
    setTotalPages(data.totalPages);
  } catch {
    toast.error("Failed to load jobs.");
  } finally {
    setLoading(false);
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
const handleReject = async (id) => {
  try {
    await rejectOrder(id);

    toast.success("Order rejected.");

    loadOrders();
  } catch {
    toast.error("Failed to reject order.");
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
if (loading) {
  return <Spinner />;
}
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">

      <h1 className="mb-8 text-4xl font-bold">
        My Jobs
      </h1>

      {orders.length === 0 ? (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
    <div className="mb-4 text-6xl">🛠️</div>

    <h2 className="text-2xl font-bold text-slate-800">
      No jobs yet
    </h2>

    <p className="mt-2 text-slate-500">
      New customer requests will appear here.
    </p>
  </div>
) : (

        <div className="space-y-6">

          {orders.map((order) => (
           <ProviderOrderCard
  key={order.id}
  order={order}
  onAccept={handleAccept}
  onReject={handleReject}
  onStart={handleStart}
  onComplete={handleComplete}
/>
          ))}

        </div>

      )}
<Pagination
  page={page}
  totalPages={totalPages}
  onPageChange={setPage}
/>
    </div>
  );
}

export default ProviderOrders;