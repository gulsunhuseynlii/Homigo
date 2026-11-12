import { useEffect, useState } from "react";
import Button from "../ui/Button";

import {
  getUnreadCountByOrder,
} from "../../services/chatService";

import {
  onReceiveMessage,
  onMessagesRead,
} from "../../services/chatHub";

function ProviderOrderCard({
  order,
  onAccept,
  onReject,
  onStart,
  onComplete,
  onChat,
}) {
  const [unreadCount, setUnreadCount] = useState(0);

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
      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const canChat = [
    "Pending",
    "Accepted",
    "InProgress",
  ].includes(order.status);

  useEffect(() => {
    if (!canChat) {
      setUnreadCount(0);
      return;
    }

    const loadUnreadCount = async () => {
      try {
        const count = await getUnreadCountByOrder(order.id);

        setUnreadCount(count);
      } catch (error) {
        console.error(
          "Failed to load unread message count.",
          error
        );
      }
    };

    loadUnreadCount();

    const unsubscribeMessage = onReceiveMessage(
      (message) => {
        console.log(
          "PROVIDER RECEIVED MESSAGE:",
          message
        );

        if (
          Number(message.orderId) !==
          Number(order.id)
        ) {
          return;
        }

        setUnreadCount((prev) => prev + 1);
      }
    );

    const unsubscribeRead = onMessagesRead(
      (orderId) => {
        if (
          Number(orderId) !==
          Number(order.id)
        ) {
          return;
        }

        setUnreadCount(0);
      }
    );

    return () => {
      unsubscribeMessage?.();
      unsubscribeRead?.();
    };
  }, [order.id, canChat]);

  const handleChat = () => {
    setUnreadCount(0);
    onChat(order);
  };

  /*
   * GOOGLE MAPS
   *
   * Customer address-dən gələn latitude və longitude
   * əsasında Google Maps linki yaradırıq.
   */

  const hasLocation =
    order.address?.latitude != null &&
    order.address?.longitude != null;

  /*
   * MAP YALNIZ AKTIV SIFARISLER UCUN GORUNUR.
   *
   * Pending     -> Map
   * Accepted    -> Map
   * InProgress  -> Map
   *
   * Completed   -> No Map
   * Cancelled   -> No Map
   * Rejected    -> No Map
   */

  const canViewMap = [
    "Pending",
    "Accepted",
    "InProgress",
  ].includes(order.status);

  const handleViewMap = () => {
    if (!hasLocation) {
      return;
    }

    const latitude = order.address.latitude;
    const longitude = order.address.longitude;

    const googleMapsUrl =
      `https://www.google.com/maps?q=${latitude},${longitude}`;

    window.open(
      googleMapsUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow">

      {/* HEADER */}

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

      {/* ORDER DETAILS */}

      <div className="mt-5 space-y-3">

        {/* CUSTOMER */}

        <p>
          <strong>Customer:</strong>{" "}
          {order.customerName}
        </p>

        {/* ADDRESS */}

        <div>
          <strong>Address:</strong>

          <div className="mt-2 space-y-1 text-slate-700">

            <p>
              {order.address?.city},{" "}
              {order.address?.district}
            </p>

            {order.address?.street && (
              <p>
                {order.address.street}
                {order.address.building
                  ? `, Building ${order.address.building}`
                  : ""}
              </p>
            )}

            {order.address?.apartment && (
              <p>
                Apartment{" "}
                {order.address.apartment}
              </p>
            )}

            {order.address?.title && (
              <p className="text-sm text-gray-500">
                ({order.address.title})
              </p>
            )}

          </div>

          {/* GOOGLE MAP BUTTON */}

          {hasLocation && canViewMap && (
            <button
              type="button"
              onClick={handleViewMap}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
            >
              📍 View on Map
            </button>
          )}

          {/* LOCATION NOT AVAILABLE */}

          {hasLocation === false && canViewMap && (
            <p className="mt-3 text-sm text-gray-400">
              Location is not available.
            </p>
          )}

        </div>

        {/* DATE */}

        <p>
          <strong>Date:</strong>{" "}
          {new Date(
            order.scheduledDate
          ).toLocaleString()}
        </p>

        {/* TOTAL */}

        <p>
          <strong>Total:</strong>{" "}
          {order.totalPrice} $
        </p>

      </div>

      {/* ACTION BUTTONS */}

      <div className="mt-6 flex flex-wrap gap-3">

        {/* PENDING */}

        {order.status === "Pending" && (
          <>
            <Button
              onClick={() =>
                onAccept(order.id)
              }
            >
              Accept
            </Button>

            <button
              onClick={() =>
                onReject(order.id)
              }
              className="rounded-lg bg-red-600 px-6 py-2 text-white transition hover:bg-red-700"
            >
              Reject
            </button>
          </>
        )}

        {/* ACCEPTED */}

        {order.status === "Accepted" && (
          <Button
            onClick={() =>
              onStart(order.id)
            }
          >
            Start
          </Button>
        )}

        {/* IN PROGRESS */}

        {order.status === "InProgress" && (
          <Button
            onClick={() =>
              onComplete(order.id)
            }
          >
            Complete
          </Button>
        )}

        {/* COMPLETED */}

        {order.status === "Completed" && (
          <div className="font-semibold text-green-600">
            Completed
          </div>
        )}

        {/* REJECTED */}

        {order.status === "Rejected" && (
          <div className="font-semibold text-red-600">
            Rejected
          </div>
        )}

        {/* CANCELLED */}

        {order.status === "Cancelled" && (
          <div className="font-semibold text-red-600">
            Cancelled
          </div>
        )}

        {/* CHAT */}

        {canChat && (
          <button
            onClick={handleChat}
            className="relative rounded-lg bg-slate-800 px-6 py-2 text-white transition hover:bg-slate-900"
          >
            Chat

            {unreadCount > 0 && (
              <span className="absolute -right-2 -top-2 flex min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 py-0.5 text-xs font-bold text-white">
                {unreadCount > 99
                  ? "99+"
                  : unreadCount}
              </span>
            )}
          </button>
        )}

      </div>

    </div>
  );
}

export default ProviderOrderCard;