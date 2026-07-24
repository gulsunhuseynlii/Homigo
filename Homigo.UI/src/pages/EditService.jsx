import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getServiceById,
  updateService,
} from "../services/serviceService";

function EditService() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    basePrice: "",
    estimatedMinutes: "",
    image: null,
  });

  useEffect(() => {
    loadService();
  }, []);

  const loadService = async () => {
    try {
      const data = await getServiceById(id);

      setForm({
        name: data.name,
        description: data.description,
        basePrice: data.basePrice,
        estimatedMinutes: data.estimatedMinutes,
        image: null,
      });
    } catch {
      toast.error("Failed to load service.");
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("basePrice", form.basePrice);
      formData.append(
        "estimatedMinutes",
        form.estimatedMinutes
      );

      if (form.image) {
        formData.append("image", form.image);
      }

      await updateService(id, formData);

      toast.success("Service updated.");

      navigate("/provider/services");
    } catch {
      toast.error("Failed to update service.");
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-8 text-4xl font-bold">
        Edit Service
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl bg-white p-8 shadow"
      >
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Service name"
          className="w-full rounded-lg border p-3"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full rounded-lg border p-3"
        />

        <input
          type="number"
          name="basePrice"
          value={form.basePrice}
          onChange={handleChange}
          placeholder="Price"
          className="w-full rounded-lg border p-3"
        />

        <input
          type="number"
          name="estimatedMinutes"
          value={form.estimatedMinutes}
          onChange={handleChange}
          placeholder="Estimated Minutes"
          className="w-full rounded-lg border p-3"
        />

        <input
          type="file"
          name="image"
          onChange={handleChange}
          className="w-full"
        />

        <button
          type="submit"
          className="w-full rounded-xl bg-blue-600 py-3 text-white hover:bg-blue-700"
        >
          Update Service
        </button>
      </form>
    </div>
  );
}

export default EditService;