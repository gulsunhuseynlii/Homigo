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

  // Delete modal
  const [deleteServiceId, setDeleteServiceId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await getMyServices();

      console.log(data);

      setServices(data);
    } catch {
      toast.error("Failed to load services.");
    }
  };

  // Open delete modal
  const handleDeleteClick = (id) => {
    setDeleteServiceId(id);
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    if (!deleteServiceId) return;

    try {
      setDeleting(true);

      await deleteService(deleteServiceId);

      toast.success("Service deleted.");

      setDeleteServiceId(null);

      await loadServices();
    } catch {
      toast.error("Failed to delete service.");
    } finally {
      setDeleting(false);
    }
  };

  // Close modal
  const handleDeleteClose = () => {
    if (deleting) return;

    setDeleteServiceId(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">

      {/* Header */}

      <div className="mb-8 flex items-center justify-between">

        <h1 className="text-4xl font-bold">
          My Services
        </h1>

        <button
          onClick={() =>
            navigate("/provider/services/create")
          }
          className="rounded-xl bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
        >
          + Add Service
        </button>

      </div>


      {/* Services */}

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

              {/* Image */}

              {service.imageUrl && (

                <img
                  src={`https://localhost:7121${service.imageUrl}`}
                  alt={service.name}
                  className="mb-4 h-48 w-full rounded-xl object-cover"
                />

              )}


              {/* Name */}

              <h2 className="text-2xl font-bold">
                {service.name}
              </h2>


              {/* Description */}

              <p className="mt-2 text-slate-600">
                {service.description}
              </p>


              {/* Details */}

              <div className="mt-4 space-y-1">

                <p>
                  <strong>
                    Price:
                  </strong>{" "}
                  {service.basePrice} $
                </p>

                <p>
                  <strong>
                    Duration:
                  </strong>{" "}
                  {service.estimatedMinutes} min
                </p>

              </div>


              {/* Actions */}

              <div className="mt-6 flex gap-3">

                <button
                  onClick={() =>
                    navigate(
                      `/provider/services/edit/${service.id}`
                    )
                  }
                  className="rounded-lg bg-yellow-500 px-4 py-2 text-white transition hover:bg-yellow-600"
                >
                  Edit
                </button>


                <button
                  onClick={() =>
                    handleDeleteClick(service.id)
                  }
                  className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      )}


      {/* Delete Confirmation Modal */}

      {deleteServiceId && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl">

            {/* Icon */}

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl">
              ⚠️
            </div>


            {/* Title */}

            <h2 className="mt-5 text-center text-2xl font-bold text-slate-800">
              Delete Service?
            </h2>


            {/* Description */}

            <p className="mt-3 text-center text-slate-500">
              Are you sure you want to delete this service?
              This action cannot be undone.
            </p>


            {/* Buttons */}

            <div className="mt-7 flex gap-3">

              <button
                type="button"
                onClick={handleDeleteClose}
                disabled={deleting}
                className="flex-1 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Keep Service
              </button>


              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting
                  ? "Deleting..."
                  : "Yes, Delete"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default ProviderServices;