import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Pagination from "../components/common/Pagination";
import Spinner from "../components/common/Spinner";
import {
  getMyOrders,
  cancelOrder,
} from "../services/orderService";

import OrderCard from "../components/order/OrderCard";
import ReviewModal from "../components/review/ReviewModal";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const [selectedOrder, setSelectedOrder] = useState(null);

useEffect(() => {
  loadOrders();
}, [page]);

const loadOrders = async () => {
  try {
    setLoading(true);

    const data = await getMyOrders({
      page,
      pageSize: 5,
    });

    setOrders(data.items);
    setTotalPages(data.totalPages);
  } catch {
    toast.error("Failed to load orders.");
  } finally {
    setLoading(false);
  }
};

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this order?")) return;

    try {
      await cancelOrder(id);

      toast.success("Order cancelled.");

      loadOrders();
    } catch {
      toast.error("Failed to cancel order.");
    }
  };

 const handleReview = (order) => {
  setSelectedOrder(order);
};
if (loading) {
  return <Spinner />;
}

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-8 text-4xl font-bold">
        My Orders
      </h1>

     {orders.length === 0 ? (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
    <div className="mb-4 text-6xl">📦</div>

    <h2 className="text-2xl font-bold text-slate-800">
      No orders yet
    </h2>

    <p className="mt-2 text-slate-500">
      Book your first service to get started.
    </p>
  </div>
) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onCancel={handleCancel}
              onReview={handleReview}
            />
          ))}
        </div>
      )}
      {selectedOrder && (
  <ReviewModal
    order={selectedOrder}
    onClose={() => setSelectedOrder(null)}
    onSuccess={() => {
      toast.success("Review added successfully.");

      setSelectedOrder(null);

      loadOrders();
    }}
  />
)}
<Pagination
  page={page}
  totalPages={totalPages}
  onPageChange={setPage}
/>
    </div>
  );
}

export default MyOrders;