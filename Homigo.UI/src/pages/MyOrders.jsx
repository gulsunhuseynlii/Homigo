import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Pagination from "../components/common/Pagination";
import Spinner from "../components/common/Spinner";
import ChatModal from "../components/chat/ChatModal";

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
  const [chatOrder, setChatOrder] = useState(null);

  // Cancel modal
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [cancelling, setCancelling] = useState(false);

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

 const handleCancelClick = (id) => {
  setCancelOrderId(id);
};

const handleCancelConfirm = async () => {
  if (!cancelOrderId) return;

  try {
    setCancelling(true);

    await cancelOrder(cancelOrderId);

    toast.success("Order cancelled.");

    setCancelOrderId(null);

    await loadOrders();
  } catch {
    toast.error("Failed to cancel order.");
  } finally {
    setCancelling(false);
  }
};

const handleCancelClose = () => {
  if (cancelling) return;

  setCancelOrderId(null);
};

  const handleReview = (order) => {
    setSelectedOrder(order);
  };

  const handleChat = (order) => {
    setChatOrder(order);
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

          <div className="mb-4 text-6xl">
            📦
          </div>

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
  onCancel={handleCancelClick}
  onReview={handleReview}
  onChat={handleChat}
/>
          ))}

        </div>
      )}

      {/* Review Modal */}
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

      {/* Chat Modal */}
      {chatOrder && (
        <ChatModal
          orderId={chatOrder.id}
          onClose={() => setChatOrder(null)}
        />
      )}

      {/* Cancel Confirmation Modal */}
      {cancelOrderId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl">

            {/* Icon */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl">
              ⚠️
            </div>

            {/* Title */}
            <h2 className="mt-5 text-center text-2xl font-bold text-slate-800">
              Cancel Order?
            </h2>

            {/* Description */}
            <p className="mt-3 text-center text-slate-500">
              Are you sure you want to cancel this order?
              This action cannot be undone.
            </p>

            {/* Buttons */}
            <div className="mt-7 flex gap-3">

              <button
                type="button"
                onClick={handleCancelClose}
                disabled={cancelling}
                className="flex-1 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Keep Order
              </button>

              <button
                type="button"
                onClick={handleCancelConfirm}
                disabled={cancelling}
                className="flex-1 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>

            </div>

          </div>

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

export default MyOrders;