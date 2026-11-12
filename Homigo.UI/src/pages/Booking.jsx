import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import { getAddresses } from "../services/addressService";
import {
  getProviderById,
  getAvailableSlots,
} from "../services/providerService";
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

  const [selectedDate, setSelectedDate] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");

  /*
   * Bugünün tarixini YYYY-MM-DD formatında qaytarır.
   */
  const getToday = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  /*
   * Seçilmiş tarix bu gündürmü?
   */
  const isToday = selectedDate === getToday();

  /*
   * Hazırkı saat.
   */
  const getCurrentHour = () => {
    return new Date().getHours();
  };

  /*
   * Hazırkı dəqiqə.
   */
  const getCurrentMinute = () => {
    return new Date().getMinutes();
  };

  /*
   * Seçilmiş tarix dəyişəndə
   * həmin günün available slotlarını yükləyirik.
   */
  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots([]);
      return;
    }

    loadAvailableSlots();
  }, [selectedDate]);

  const loadAvailableSlots = async () => {
    try {
      console.log("Loading slots...");
      console.log("Provider:", providerId);
      console.log("Date:", selectedDate);

      const data = await getAvailableSlots(
        providerId,
        selectedDate
      );

      console.log("Slots:", data);

      setAvailableSlots(data);
    } catch (error) {
      console.log(error);

      toast.error(
        "Failed to load available times."
      );

      setAvailableSlots([]);
    }
  };

  /*
   * Service, provider və address məlumatlarını yükləyirik.
   */
  useEffect(() => {
    loadPage();
  }, []);

  const loadPage = async () => {
    try {
      const serviceData =
        await getServiceById(serviceId);

      const providerData =
        await getProviderById(providerId);

      const addressData =
        await getAddresses();

      setService(serviceData);
      setProvider(providerData);
      setAddresses(addressData);

      if (addressData.length > 0) {
        setAddressId(
          addressData[0].id
        );
      }
    } catch (error) {
      console.log(error.response);

      toast.error(
        "Failed to load booking."
      );
    }
  };

  /*
   * Saatın keçmiş olub-olmadığını yoxlayırıq.
   *
   * Məsələn:
   *
   * İndi 15:30-dırsa:
   *
   * 09:00 -> false
   * 10:00 -> false
   * 14:00 -> false
   * 15:00 -> false
   * 16:00 -> true
   * 17:00 -> true
   */
  const isTimeAvailable = (time) => {
    /*
     * Sabah və sonrakı günlərdirsə,
     * saat baxımından heç nə bloklamırıq.
     */
    if (!isToday) {
      return true;
    }

    const [hour, minute] =
      time.split(":").map(Number);

    const currentHour =
      getCurrentHour();

    const currentMinute =
      getCurrentMinute();

    /*
     * Saat keçibsə -> false
     */
    if (hour < currentHour) {
      return false;
    }

    /*
     * Eyni saatdırsa,
     * dəqiqəyə də baxırıq.
     */
    if (
      hour === currentHour &&
      minute <= currentMinute
    ) {
      return false;
    }

    return true;
  };

  /*
   * Backend-dən gələn slotları filtr edirik.
   *
   * 1. isAvailable true olmalıdır
   * 2. Bu gündürsə keçmiş saat olmamalıdır
   */
  const filteredSlots =
    availableSlots.filter((slot) => {
      if (!slot.isAvailable) {
        return false;
      }

      return isTimeAvailable(
        slot.time
      );
    });

  const handleSubmit = async () => {
    if (!addressId) {
      toast.error(
        "Please select an address."
      );
      return;
    }

    if (!selectedDate || !selectedTime) {
      toast.error(
        "Please select date and time."
      );
      return;
    }

    /*
     * Əlavə təhlükəsizlik:
     * istifadəçi köhnə saatı seçə bilməsin.
     */
    if (!isTimeAvailable(selectedTime)) {
      toast.error(
        "This time is no longer available."
      );

      setSelectedTime("");

      return;
    }

    try {
      const result = await createOrder({
        serviceId: Number(serviceId),
        providerId: Number(providerId),
        addressId: Number(addressId),
        scheduledDate:
          `${selectedDate}T${selectedTime}`,
      });

      toast.success(
        "Order created successfully."
      );

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

      toast.error(
        "Failed to create order."
      );
    }
  };

  if (!service || !provider) {
    return (
      <h2 className="p-10">
        Loading...
      </h2>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">

      <h1 className="mb-8 text-4xl font-bold">
        Booking
      </h1>

      <div className="rounded-2xl bg-white p-8 shadow">

        {/* Service information */}

        <div className="space-y-3">

          <p>
            <strong>
              Service:
            </strong>{" "}
            {service.name}
          </p>

          <p>
            <strong>
              Provider:
            </strong>{" "}
            {provider.fullName}
          </p>

          <p>
            <strong>
              Price:
            </strong>{" "}
            {service.basePrice} $
          </p>

        </div>


        {/* Address */}

        <div className="mt-8">

          <label className="mb-2 block font-semibold">
            Address
          </label>

          <select
            className="w-full rounded-lg border p-3"
            value={addressId}
            onChange={(e) =>
              setAddressId(
                e.target.value
              )
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


        {/* Date */}

        <div className="mt-6">

          <label className="mb-2 block font-semibold">
            Select Date
          </label>

          <input
            type="date"
            min={getToday()}
            className="w-full rounded-xl border p-3"
            value={selectedDate}
            onChange={(e) => {

              const date =
                e.target.value;

              /*
               * Keçmiş tarix seçilməsinə
               * əlavə müdafiə.
               */
              if (date < getToday()) {
                toast.error(
                  "You cannot select a past date."
                );

                return;
              }

              setSelectedDate(date);
              setSelectedTime("");
            }}
          />

        </div>


        {/* Available Times */}

        <div className="mt-6">

          <label className="mb-3 block font-semibold">
            Available Times
          </label>


          {!selectedDate ? (

            <p className="text-slate-500">
              Select a date to see available times.
            </p>

          ) : filteredSlots.length === 0 ? (

            <p className="text-red-500">
              No available times for this day.
            </p>

          ) : (

            <div className="flex flex-wrap gap-3">

              {filteredSlots.map((slot) => (

                <button
                  key={slot.time}
                  type="button"
                  onClick={() =>
                    setSelectedTime(
                      slot.time
                    )
                  }
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


        {/* Confirm */}

        <button
          onClick={handleSubmit}
          className="mt-8 w-full rounded-xl bg-blue-600 py-3 text-white hover:bg-blue-700"
        >
          Confirm Booking
        </button>

      </div>

    </div>
  );
}

export default Booking;