import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { createService } from "../services/serviceService";
import { getCategories } from "../services/categoryService";

function CreateService() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    basePrice: "",
    estimatedMinutes: "",
    categoryId: "",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data.items ?? data);
    } catch {
      toast.error("Failed to load categories.");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createService({
        ...form,
        basePrice: Number(form.basePrice),
        estimatedMinutes: Number(form.estimatedMinutes),
        categoryId: Number(form.categoryId),
      });

      toast.success("Service created successfully.");

      navigate("/provider/services");
    } catch {
      toast.error("Failed to create service.");
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">

      <h1 className="mb-8 text-4xl font-bold">
        Create Service
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl bg-white p-8 shadow"
      >

        <input
          name="name"
          placeholder="Service Name"
          value={form.name}
          onChange={handleChange}
          className="w-full rounded-xl border p-3"
        />

        <textarea
          name="description"
          placeholder="Description"
          rows="4"
          value={form.description}
          onChange={handleChange}
          className="w-full rounded-xl border p-3"
        />

        <input
          type="number"
          name="basePrice"
          placeholder="Price"
          value={form.basePrice}
          onChange={handleChange}
          className="w-full rounded-xl border p-3"
        />

        <input
          type="number"
          name="estimatedMinutes"
          placeholder="Estimated Minutes"
          value={form.estimatedMinutes}
          onChange={handleChange}
          className="w-full rounded-xl border p-3"
        />

        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          className="w-full rounded-xl border p-3"
        >
          <option value="">
            Select Category
          </option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>

        <button
          className="rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          Create Service
        </button>

      </form>

    </div>
  );
}

export default CreateService;