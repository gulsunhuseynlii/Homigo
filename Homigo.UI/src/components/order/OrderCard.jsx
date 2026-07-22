function OrderCard({ order }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">

      <div className="flex items-center justify-between">

        <h2 className="text-2xl font-bold">
          {order.serviceName}
        </h2>

        <span className="rounded-full bg-blue-100 px-4 py-2 text-sm text-blue-700">
          {order.status}
        </span>

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