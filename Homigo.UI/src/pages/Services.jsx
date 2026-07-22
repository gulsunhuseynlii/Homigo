import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import { getServices } from "../services/serviceService";
import { getRole } from "../utils/auth";

function Services() {
  const [services, setServices] = useState([]);

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const role = getRole();

  const categoryId = searchParams.get("categoryId");

  useEffect(() => {
    loadServices();
  }, [categoryId]);

  const loadServices = async () => {
    try {
      const data = await getServices({
        categoryId,
      });

      setServices(data.items ?? data);
    } catch {
      toast.error("Failed to load services.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">

      <h1 className="mb-8 text-4xl font-bold">
        Services
      </h1>

      {services.length === 0 ? (
        <p>No services found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {services.map((service) => (

            <div
              key={service.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow transition hover:shadow-xl"
            >
              <h2 className="text-2xl font-bold">
                {service.name}
              </h2>

              <p className="mt-3 text-slate-600">
                {service.description}
              </p>

              <div className="mt-5 space-y-2">

                <p>
                  <strong>Price:</strong>{" "}
                  {service.basePrice} ₼
                </p>

                <p>
                  <strong>Duration:</strong>{" "}
                  {service.estimatedMinutes} min
                </p>

              </div>

              <div className="mt-6 flex gap-3">

                <button
                  onClick={() =>
                    navigate(`/services/${service.id}`)
                  }
                  className="rounded-xl border border-blue-600 px-5 py-2 text-blue-600 transition hover:bg-blue-50"
                >
                  View Details
                </button>

                {role === "Customer" && (
                  <button
                    onClick={() =>
                      navigate(
                        `/providers?serviceId=${service.id}`
                      )
                    }
                    className="rounded-xl bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
                  >
                    Choose Provider
                  </button>
                )}

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default Services;