import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import { getAddresses } from "../services/addressService";
import { getProviderById } from "../services/providerService";
import { getServiceById } from "../services/serviceService";
import { createOrder } from "../services/orderService";

function Booking() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const serviceId = searchParams.get("serviceId");
  const providerId = searchParams.get("providerId");

  const [service, setService] = useState(null);
  const [provider, setProvider] = useState(null);

  const [addresses, setAddresses] = useState([]);

  const [addressId, setAddressId] = useState("");

  const [scheduledDate, setScheduledDate] = useState("");

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

  const handleSubmit = async () => {
    if (!scheduledDate) {
      toast.error("Please select a date.");

      return;
    }

    try {
      await createOrder({
        serviceId: Number(serviceId),
        providerId: Number(providerId),
        addressId: Number(addressId),
        scheduledDate,
      });

      toast.success("Order created successfully.");

      navigate("/my-orders");
    } catch {
      toast.error("Booking failed.");
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
            Date
          </label>

          <input
            type="datetime-local"
            className="w-full rounded-lg border p-3"
            value={scheduledDate}
            onChange={(e) =>
              setScheduledDate(e.target.value)
            }
          />

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