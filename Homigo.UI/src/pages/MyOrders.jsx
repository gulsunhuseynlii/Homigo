import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getMyOrders,
  cancelOrder,
} from "../services/orderService";

import OrderCard from "../components/order/OrderCard";
import ReviewModal from "../components/review/ReviewModal";

function MyOrders() {
  const [orders, setOrders] = useState([]);
const [selectedOrder, setSelectedOrder] = useState(null);
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getMyOrders();

      setOrders(data);
    } catch {
      toast.error("Failed to load orders.");
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

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-8 text-4xl font-bold">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="rounded-2xl bg-slate-100 p-10 text-center">
          <h2 className="text-2xl font-semibold">
            No orders yet
          </h2>
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
    </div>
  );
}

export default MyOrders;