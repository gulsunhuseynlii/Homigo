import Button from "../ui/Button";

function ProviderOrderCard({
  order,
  onAccept,
  onStart,
  onComplete,
}) {
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

      <div className="mt-5 space-y-2">
<p>
  <strong>Customer:</strong> {order.customerName}
</p>
        <p>
          <strong>Address:</strong> {order.addressTitle}
        </p>

        <p>
          <strong>Date:</strong>{" "}
          {new Date(order.scheduledDate).toLocaleString()}
        </p>

        <p>
          <strong>Total:</strong> {order.totalPrice} ₼
        </p>

      </div>

      <div className="mt-6">

        {order.status === "Pending" && (
          <Button onClick={() => onAccept(order.id)}>
            Accept
          </Button>
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

      </div>

    </div>
  );
}

export default ProviderOrderCard;