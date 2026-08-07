import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import { getAddresses } from "../services/addressService";
import { getProviderById } from "../services/providerService";
import { getServiceById } from "../services/serviceService";
import { createOrder } from "../services/orderService";
import { getAvailableSlots } from "../services/providerService";

function Booking() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const serviceId = searchParams.get("serviceId");
  const providerId = searchParams.get("providerId");

  const [service, setService] = useState(null);
  const [provider, setProvider] = useState(null);

  const [addresses, setAddresses] = useState([]);

  const [addressId, setAddressId] = useState("");

const [selectedDate, setSelectedDate] = useState("");

const [availableSlots, setAvailableSlots] = useState([]);

const [selectedTime, setSelectedTime] = useState("");
useEffect(() => {
  if (!selectedDate) return;

  loadAvailableSlots();
}, [selectedDate]);
const loadAvailableSlots = async () => {
  try {
    console.log("Loading slots...");
    console.log(providerId);
    console.log(selectedDate);

    const data = await getAvailableSlots(
      providerId,
      selectedDate
    );

    console.log("Slots:", data);

    setAvailableSlots(data);
  } catch (error) {
    console.log(error);
    toast.error("Failed to load available times.");
  }
};
  useEffect(() => {
    loadPage();
  }, []);

 const loadPage = async () => {
  try {
    const serviceData = await getServiceById(serviceId);
    console.log("Service:", serviceData);

    const providerData = await getProviderById(providerId);
    console.log("Provider:", providerData);

    const addressData = await getAddresses();
    console.log("Addresses:", addressData);

    setService(serviceData);
    setProvider(providerData);
    setAddresses(addressData);

    if (addressData.length > 0) {
      setAddressId(addressData[0].id);
    }
  } catch (error) {
    console.log(error.response);
    toast.error("Failed to load booking.");
  }
};
console.log({
  serviceId: Number(serviceId),
  providerId: Number(providerId),
  addressId: Number(addressId),
  selectedDate,
  selectedTime,
});
const handleSubmit = async () => {
 if (!selectedDate || !selectedTime) {
  toast.error("Please select date and time.");
  return;
}

  try {
    const result = await createOrder({
      serviceId: Number(serviceId),
      providerId: Number(providerId),
      addressId: Number(addressId),
      scheduledDate: `${selectedDate}T${selectedTime}`,
    });

    toast.success("Order created successfully.");

    navigate("/payment", {
      state: {
        orderId: result.orderId,
        serviceName: service.name,
        providerName: provider.fullName,
        totalPrice: service.basePrice,
      },
    });
  } catch (error) {
    console.log(error.response);
    toast.error("Failed to create order.");
  }
};

  if (!service || !provider)
    return <h2 className="p-10">Loading...</h2>;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">

      <h1 className="mb-8 text-4xl font-bold">
        Booking
      </h1>

      <div className="rounded-2xl bg-white p-8 shadow">

        <div className="space-y-3">

          <p>
            <strong>Service:</strong> {service.name}
          </p>

          <p>
            <strong>Provider:</strong> {provider.fullName}
          </p>

          <p>
            <strong>Price:</strong> {service.basePrice} ₼
          </p>

        </div>

        <div className="mt-8">

          <label className="mb-2 block font-semibold">
            Address
          </label>

          <select
            className="w-full rounded-lg border p-3"
            value={addressId}
            onChange={(e) =>
              setAddressId(e.target.value)
            }
          >
            {addresses.map((address) => (
              <option
                key={address.id}
                value={address.id}
              >
                {address.title}
              </option>
            ))}
          </select>

        </div>

        <div className="mt-6">

  <label className="mb-2 block font-semibold">
    Select Date
  </label>

  <input
    type="date"
    className="w-full rounded-xl border p-3"
    value={selectedDate}
    onChange={(e) => {
      setSelectedDate(e.target.value);
      setSelectedTime("");
    }}
  />

</div>

<div className="mt-6">

  <label className="mb-3 block font-semibold">
    Available Times
  </label>

{!selectedDate ? (
  <p className="text-slate-500">
    Select a date to see available times.
  </p>
) : availableSlots.length === 0 ? (
  <p className="text-red-500">
    No available times for this day.
  </p>
) : (
    <div className="flex flex-wrap gap-3">

      {availableSlots
        .filter((x) => x.isAvailable)
        .map((slot) => (
          <button
            key={slot.time}
            type="button"
            onClick={() => setSelectedTime(slot.time)}
            className={`rounded-xl border px-5 py-3 transition ${
              selectedTime === slot.time
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-slate-300 bg-white hover:bg-slate-100"
            }`}
          >
            {slot.time.slice(0, 5)}
          </button>
        ))}

    </div>
  )}

</div>

        <button
          onClick={handleSubmit}
          className="mt-8 w-full rounded-xl bg-blue-600 py-3 text-white"
        >
          Confirm Booking
        </button>

      </div>

    </div>
  );
}

export default Booking;