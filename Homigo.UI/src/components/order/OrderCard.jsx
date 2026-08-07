function OrderCard({
  order,
  onCancel,
  onReview,
  onChat,
}) {
  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Accepted":
        return "bg-blue-100 text-blue-700";

      case "InProgress":
        return "bg-purple-100 text-purple-700";

      case "Completed":
        return "bg-green-100 text-green-700";

      case "Cancelled":
      case "Rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const getPaymentStyle = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";

      case "Refunded":
        return "bg-red-100 text-red-700";

      case "Unpaid":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {order.serviceName}
        </h2>

        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-4 py-2 text-sm font-medium ${getStatusStyle(
              order.status
            )}`}
          >
            {order.status}
          </span>

          {order.paymentStatus && (
            <span
              className={`rounded-full px-4 py-2 text-sm font-medium ${getPaymentStyle(
                order.paymentStatus
              )}`}
            >
              {order.paymentStatus}
            </span>
          )}

          {order.status === "Pending" && (
            <button
              onClick={() => onCancel(order.id)}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-700"
            >
              Cancel
            </button>
          )}

          {order.status === "Completed" && (
            <button
              onClick={() => onReview(order)}
              className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-yellow-600"
            >
              ⭐ Review
            </button>
          )}
        </div>
      </div>

      <div className="mt-5 space-y-2 text-slate-600">
        <p>
          <strong>Provider:</strong>{" "}
          {order.providerName || "-"}
        </p>

        <div>
  <strong>Address:</strong>

  <p>
    {order.address.city}, {order.address.district}
  </p>

  <p>
    {order.address.street}, Building {order.address.building}
  </p>

  <p>
    Apartment {order.address.apartment}
  </p>

  <p className="text-sm text-gray-500">
    ({order.address.title})
  </p>
</div>

        <p>
          <strong>Date:</strong>{" "}
          {new Date(order.scheduledDate).toLocaleString()}
        </p>

        <p>
          <strong>Total:</strong>{" "}
          {order.totalPrice} ₼
        </p>
        <div className="mt-6">
  <button
    onClick={() => onChat(order)}
    className="rounded-lg bg-slate-800 px-6 py-2 text-white transition hover:bg-slate-900"
  >
    💬 Chat
  </button>
</div>
      </div>
    </div>
  );
}

export default OrderCard;