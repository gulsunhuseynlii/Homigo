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

      loadServices();
    } catch {
      toast.error("Failed to create service.");
    }
  };

  const handleEdit = async (data) => {
    try {
      await updateService(selectedService.id, data);

      toast.success("Service updated.");

      setSelectedService(null);
      setIsOpen(false);

      loadServices();
    } catch {
      toast.error("Failed to update service.");
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
          Services
        </h1>
      </div>

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
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

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
    </div>
  );
}

export default AdminServices;