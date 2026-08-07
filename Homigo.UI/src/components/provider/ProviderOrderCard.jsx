import Button from "../ui/Button";

function ProviderOrderCard({
  order,
  onAccept,
  onReject,
  onStart,
  onComplete,
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

      case "Rejected":
        return "bg-red-100 text-red-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

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

        <span
          className={`rounded-full px-4 py-2 text-sm font-medium ${getStatusStyle(
            order.status
          )}`}
        >
          {order.status}
        </span>

      </div>

      <div className="mt-5 space-y-2">

        <p>
          <strong>Customer:</strong> {order.customerName}
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
          <strong>Total:</strong> {order.totalPrice} ₼
        </p>

      </div>

    <div className="mt-6 flex flex-wrap gap-3">

  {order.status === "Pending" && (
    <>
      <Button onClick={() => onAccept(order.id)}>
        Accept
      </Button>

      <button
        onClick={() => onReject(order.id)}
        className="rounded-lg bg-red-600 px-6 py-2 text-white hover:bg-red-700"
      >
        Reject
      </button>
    </>
  )}

  {order.status === "Accepted" && (
    <Button onClick={() => onStart(order.id)}>
      Start
    </Button>
  )}

  {order.status === "InProgress" && (
    <Button onClick={() => onComplete(order.id)}>
      Complete
    </Button>
  )}

  {order.status === "Completed" && (
    <div className="font-semibold text-green-600">
      ✅ Completed
    </div>
  )}

  {order.status === "Rejected" && (
    <div className="font-semibold text-red-600">
      ❌ Rejected
    </div>
  )}

  {order.status === "Cancelled" && (
    <div className="font-semibold text-red-600">
      ❌ Cancelled
    </div>
  )}

  {/* Chat həmişə görünsün */}
  <button
    onClick={() => onChat(order)}
    className="rounded-lg bg-slate-800 px-6 py-2 text-white hover:bg-slate-900"
  >
    💬 Chat
  </button>

</div>
    </div>
  );
}

export default ProviderOrderCard;