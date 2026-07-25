import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { createService } from "../services/serviceService";

function CreateService() {
  const navigate = useNavigate();


const [form, setForm] = useState({
  name: "",
  description: "",
  basePrice: "",
  estimatedMinutes: "",
  image: null,
});

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();

    formData.append("Name", form.name);
    formData.append("Description", form.description);
    formData.append("BasePrice", form.basePrice);
    formData.append("EstimatedMinutes", form.estimatedMinutes);

    if (form.image) {
      formData.append("Image", form.image);
    }

    await createService(formData);

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
<div>
  <label className="mb-2 block font-medium">
    Service Image
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={(e) =>
      setForm({
        ...form,
        image: e.target.files[0],
      })
    }
    className="w-full rounded-xl border p-3"
  />
</div>
       

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