import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getServices,
  getCategories,
  createService,
  updateService,
  deleteService,
} from "../services/adminService";

import ServiceCard from "../components/admin/ServiceCard";
import ServiceForm from "../components/admin/ServiceForm";

function AdminServices() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  // Delete modal
  const [deleteServiceId, setDeleteServiceId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadServices();
    loadCategories();
  }, []);

  const loadServices = async () => {
    try {
      const data = await getServices();

      setServices(data);
    } catch {
      toast.error("Failed to load services.");
    }
  };

  const loadCategories = async () => {
    try {
      const data = await getCategories();

      setCategories(data);
    } catch {
      toast.error("Failed to load categories.");
    }
  };

  const handleCreate = async (data) => {
    try {
      await createService(data);

      toast.success("Service created.");

      setIsOpen(false);

      await loadServices();
    } catch {
      toast.error("Failed to create service.");
    }
  };

  const handleEdit = async (data) => {
    try {
      await updateService(
        selectedService.id,
        data
      );

      toast.success("Service updated.");

      setSelectedService(null);
      setIsOpen(false);

      await loadServices();
    } catch {
      toast.error("Failed to update service.");
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

  // Close delete modal
  const handleDeleteClose = () => {
    if (deleting) return;

    setDeleteServiceId(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">

      {/* Header */}

      <div className="mb-8 flex items-center justify-between">

        <h1 className="text-4xl font-bold">
          Services
        </h1>

      </div>


      {/* Services */}

      {services.length === 0 ? (

        <div className="rounded-2xl bg-slate-100 p-10 text-center">

          <h2 className="text-2xl font-semibold">
            No services found.
          </h2>

        </div>

      ) : (

        <div className="grid gap-6 md:grid-cols-2">

          {services.map((service, index) => (

            <ServiceCard
              key={service.id}
              index={index}
              service={service}

              onEdit={(service) => {
                setSelectedService(service);
                setIsOpen(true);
              }}

              onDelete={handleDeleteClick}
            />

          ))}

        </div>

      )}


      {/* Service Form */}

      {isOpen && (

        <ServiceForm
          categories={categories}
          initialData={selectedService}

          onCancel={() => {
            setSelectedService(null);
            setIsOpen(false);
          }}

          onSubmit={
            selectedService
              ? handleEdit
              : handleCreate
          }
        />

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

export default AdminServices;