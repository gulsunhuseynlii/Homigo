function OrderCard({
  order,
  onCancel,
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
        return "bg-red-100 text-red-700";

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

      case "Unpaid":
        return "bg-red-100 text-red-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

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

         {order.paymentStatus && order.paymentStatus !== "0" && (
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

        </div>

      </div>

      <div className="mt-5 space-y-2 text-slate-600">

        <p>
          <strong>Provider:</strong>{" "}
          {order.providerName || "-"}
        </p>

        <p>
          <strong>Address:</strong>{" "}
          {order.addressTitle}
        </p>

        <p>
          <strong>Date:</strong>{" "}
          {new Date(order.scheduledDate).toLocaleString()}
        </p>

        <p>
          <strong>Total:</strong>{" "}
          {order.totalPrice} ₼
        </p>

      </div>

    </div>
  );
}

export default OrderCard;