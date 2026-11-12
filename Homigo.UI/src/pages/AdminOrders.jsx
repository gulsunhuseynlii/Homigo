import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

import Pagination from "../components/common/Pagination";
import Spinner from "../components/common/Spinner";

import { getAllOrders } from "../services/adminOrderService";

const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");

  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [page]);

  const loadOrders = async () => {
    try {
      setLoading(true);

      const data = await getAllOrders({
        page,
        pageSize: 10,
      });

      setOrders(data.items || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Failed to load orders:", error);

      toast.error("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

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

  const getPaymentStyle = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";

      case "Unpaid":
        return "bg-yellow-100 text-yellow-700";

      case "Refunded":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  const filteredOrders = useMemo(() => {
    const value = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !value ||
        order.serviceName
          ?.toLowerCase()
          .includes(value) ||
        order.customerName
          ?.toLowerCase()
          .includes(value) ||
        order.providerName
          ?.toLowerCase()
          .includes(value) ||
        String(order.id).includes(value);

      const matchesStatus =
        statusFilter === "All" ||
        order.status === statusFilter;

      const matchesPayment =
        paymentFilter === "All" ||
        order.paymentStatus === paymentFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPayment
      );
    });
  }, [
    orders,
    search,
    statusFilter,
    paymentFilter,
  ]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setPaymentFilter("All");
    setPage(1);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString(
      [],
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const getAddressText = (address) => {
    if (!address) {
      return "No address";
    }

    return [
      address.city,
      address.district,
      address.street,
      address.building
        ? `Building ${address.building}`
        : null,
      address.apartment
        ? `Apartment ${address.apartment}`
        : null,
    ]
      .filter(Boolean)
      .join(", ");
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* HEADER */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            Orders
          </h1>

          <p className="mt-2 text-slate-500">
            Manage and monitor all customer orders.
          </p>
        </div>

        {/* FILTERS */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

          <div className="grid gap-4 md:grid-cols-4">

            {/* SEARCH */}

            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Search orders
              </label>

              <input
                type="text"
                placeholder="Service, customer, provider or order ID..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* STATUS */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="All">
                  All statuses
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Accepted">
                  Accepted
                </option>

                <option value="InProgress">
                  In Progress
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="Rejected">
                  Rejected
                </option>

                <option value="Cancelled">
                  Cancelled
                </option>
              </select>

            </div>

            {/* PAYMENT */}

            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Payment
              </label>

              <select
                value={paymentFilter}
                onChange={(e) => {
                  setPaymentFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="All">
                  All payments
                </option>

                <option value="Paid">
                  Paid
                </option>

                <option value="Unpaid">
                  Unpaid
                </option>

                <option value="Refunded">
                  Refunded
                </option>
              </select>

            </div>

          </div>

          {(search ||
            statusFilter !== "All" ||
            paymentFilter !== "All") && (
            <button
              onClick={clearFilters}
              className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Clear filters
            </button>
          )}

        </div>

        {/* RESULT COUNT */}

        <div className="mb-4 text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-700">
            {filteredOrders.length}
          </span>{" "}
          orders
        </div>

        {/* EMPTY */}

        {filteredOrders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

            <div className="mb-4 text-6xl">
              📦
            </div>

            <h2 className="text-2xl font-bold text-slate-800">
              No orders found
            </h2>

            <p className="mt-2 text-slate-500">
              Try changing your search or filters.
            </p>

          </div>
        ) : (

          <>
            {/* DESKTOP TABLE */}

            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-slate-50">

                    <tr>

                      <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
                        Service
                      </th>

                      <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
                        Customer
                      </th>

                      <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
                        Provider
                      </th>

                      <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
                        Date
                      </th>

                      <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
                        Price
                      </th>

                      <th className="px-5 py-4 text-left text-sm font-semibold text-slate-600">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right text-sm font-semibold text-slate-600">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {filteredOrders.map((order) => (

                      <tr
                        key={order.id}
                        className="transition hover:bg-slate-50"
                      >

                        <td className="px-5 py-5">

                          <div className="font-semibold text-slate-900">
                            {order.serviceName}
                          </div>

                          <div className="mt-1 text-xs text-slate-400">
                            #{order.id}
                          </div>

                        </td>

                        <td className="px-5 py-5 text-sm text-slate-700">
                          {order.customerName}
                        </td>

                        <td className="px-5 py-5 text-sm text-slate-700">
                          {order.providerName ||
                            "Not assigned"}
                        </td>

                        <td className="px-5 py-5">

                          <div className="text-sm text-slate-700">
                            {formatDate(
                              order.scheduledDate
                            )}
                          </div>

                          <div className="mt-1 text-xs text-slate-500">
                            {formatTime(
                              order.scheduledDate
                            )}
                          </div>

                        </td>

                        <td className="px-5 py-5 font-semibold text-slate-900">
                          {order.totalPrice} $
                        </td>

                        <td className="px-5 py-5">

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>

                        </td>

                        <td className="px-5 py-5 text-right">

                          <button
                            onClick={() =>
                              setSelectedOrder(order)
                            }
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                          >
                            View Details
                          </button>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>

            {/* MOBILE */}

            <div className="space-y-4 lg:hidden">

              {filteredOrders.map((order) => (

                <div
                  key={order.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div>

                      <h2 className="font-bold text-slate-900">
                        {order.serviceName}
                      </h2>

                      <p className="mt-1 text-xs text-slate-400">
                        Order #{order.id}
                      </p>

                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>

                  </div>

                  <div className="mt-5 space-y-3 text-sm">

                    <p>
                      <strong>
                        Customer:
                      </strong>{" "}
                      {order.customerName}
                    </p>

                    <p>
                      <strong>
                        Provider:
                      </strong>{" "}
                      {order.providerName ||
                        "Not assigned"}
                    </p>

                    <p>
                      <strong>
                        Date:
                      </strong>{" "}
                      {formatDate(
                        order.scheduledDate
                      )}{" "}
                      {formatTime(
                        order.scheduledDate
                      )}
                    </p>

                    <p>
                      <strong>
                        Total:
                      </strong>{" "}
                      {order.totalPrice} $
                    </p>

                    <p>
                      <strong>
                        Payment:
                      </strong>{" "}
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${getPaymentStyle(
                          order.paymentStatus
                        )}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      setSelectedOrder(order)
                    }
                    className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-medium text-white hover:bg-blue-700"
                  >
                    View Details
                  </button>

                </div>

              ))}

            </div>
          </>
        )}

        {/* PAGINATION */}

        {orders.length > 0 && (
          <div className="mt-8">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}

      </div>

      {/* DETAILS MODAL */}

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() =>
            setSelectedOrder(null)
          }
          getStatusStyle={getStatusStyle}
          getPaymentStyle={getPaymentStyle}
          getAddressText={getAddressText}
        />
      )}

    </div>
  );
}

function OrderDetailsModal({
  order,
  onClose,
  getStatusStyle,
  getPaymentStyle,
  getAddressText,
}) {
  const address = order.address;

  const latitude =
    address?.latitude != null
      ? Number(address.latitude)
      : null;

  const longitude =
    address?.longitude != null
      ? Number(address.longitude)
      : null;

  const hasCoordinates =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude);

  const googleMapsUrl = hasCoordinates
    ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* MODAL HEADER */}

        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-5">

          <div>

            <h2 className="text-2xl font-bold text-slate-900">
              Order #{order.id}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {order.serviceName}
            </p>

          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-600 hover:bg-slate-200"
          >
            ×
          </button>

        </div>

        <div className="space-y-6 p-6">

          {/* STATUS */}

          <div className="flex flex-wrap gap-3">

            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${getStatusStyle(
                order.status
              )}`}
            >
              {order.status}
            </span>

            <span
              className={`rounded-full px-4 py-2 text-sm font-semibold ${getPaymentStyle(
                order.paymentStatus
              )}`}
            >
              Payment: {order.paymentStatus}
            </span>

          </div>

          {/* INFORMATION GRID */}

          <div className="grid gap-4 sm:grid-cols-2">

            <InfoBox
              title="Customer"
              value={order.customerName}
            />

            <InfoBox
              title="Provider"
              value={
                order.providerName ||
                "Not assigned"
              }
            />

            <InfoBox
              title="Scheduled Date"
              value={new Date(
                order.scheduledDate
              ).toLocaleString()}
            />

            <InfoBox
              title="Total Price"
              value={`${order.totalPrice} $`}
            />

          </div>

          {/* ADDRESS */}

          <div className="rounded-2xl border border-slate-200 p-5">

            <div className="flex items-center justify-between gap-4">

              <div>

                <h3 className="text-lg font-bold text-slate-900">
                  Address
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {getAddressText(address)}
                </p>

              </div>

              {googleMapsUrl && (
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  Open Maps
                </a>
              )}

            </div>

            {/* MAP */}

            {hasCoordinates ? (
              <div className="mt-5 overflow-hidden rounded-xl border">

                <APIProvider
                  apiKey={GOOGLE_MAPS_API_KEY}
                >
                  <Map
                    defaultCenter={{
                      lat: latitude,
                      lng: longitude,
                    }}
                    defaultZoom={16}
                    gestureHandling="greedy"
                    disableDefaultUI={false}
                    style={{
                      width: "100%",
                      height: "350px",
                    }}
                  >
                    <Marker
                      position={{
                        lat: latitude,
                        lng: longitude,
                      }}
                    />
                  </Map>
                </APIProvider>

              </div>
            ) : (
              <div className="mt-5 rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500">
                Location coordinates are not available for this address.
              </div>
            )}

          </div>

          {/* FOOTER */}

          <div className="flex justify-end border-t pt-5">

            <button
              onClick={onClose}
              className="rounded-xl bg-slate-800 px-6 py-3 font-medium text-white transition hover:bg-slate-900"
            >
              Close
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

function InfoBox({ title, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">

      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-1 font-semibold text-slate-900">
        {value}
      </p>

    </div>
  );
}

export default AdminOrders;