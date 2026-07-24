import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getMyServices,
  deleteService,
} from "../services/serviceService";

function ProviderServices() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await getMyServices();
      setServices(data);
    } catch {
      toast.error("Failed to load services.");
    }
  };
const handleDelete = async (id) => {
  if (!window.confirm("Delete this service?")) return;

  try {
    await deleteService(id);

    toast.success("Service deleted.");

    loadServices();
  } catch {
    toast.error("Failed to delete service.");
  }
};
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">
          My Services
        </h1>

        <button
          onClick={() => navigate("/provider/services/create")}
          className="rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          + Add Service
        </button>
      </div>

      {services.length === 0 ? (
        <div className="rounded-2xl bg-slate-100 py-16 text-center text-2xl">
          No services yet.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow"
            >
              {service.imageUrl && (
                <img
                  src={`https://localhost:7121${service.imageUrl}`}
                  alt={service.name}
                  className="mb-4 h-48 w-full rounded-xl object-cover"
                />
              )}

              <h2 className="text-2xl font-bold">
                {service.name}
              </h2>

              <p className="mt-2 text-slate-600">
                {service.description}
              </p>

              <div className="mt-4 space-y-1">
                <p>
                  <strong>Price:</strong> {service.basePrice} ₼
                </p>

                <p>
                  <strong>Duration:</strong> {service.estimatedMinutes} min
                </p>
              </div>

              <div className="mt-6 flex gap-3">
               <button
  onClick={() =>
    navigate(`/provider/services/edit/${service.id}`)
  }
  className="rounded-lg bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
>
  Edit
</button>

               <button
  onClick={() => handleDelete(service.id)}
  className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
>
  Delete
</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProviderServices;