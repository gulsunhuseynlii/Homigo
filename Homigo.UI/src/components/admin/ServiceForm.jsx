import { useEffect, useState } from "react";


function ServiceForm({
  categories,
  initialData,
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    basePrice: "",
    estimatedMinutes: "",
    imageUrl: "",
    categoryId: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        description: initialData.description,
        basePrice: initialData.basePrice,
        estimatedMinutes: initialData.estimatedMinutes,
        imageUrl: initialData.imageUrl ?? "",
        categoryId: initialData.categoryId,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...form,
      basePrice: Number(form.basePrice),
      estimatedMinutes: Number(form.estimatedMinutes),
      categoryId: Number(form.categoryId),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-xl">

        <h2 className="mb-6 text-3xl font-bold">
          {initialData ? "Edit Service" : "Add Service"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            name="name"
            placeholder="Service name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            rows={4}
            required
          />

          <input
            type="number"
            name="basePrice"
            placeholder="Price"
            value={form.basePrice}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            required
          />

          <input
            type="number"
            name="estimatedMinutes"
            placeholder="Duration (minutes)"
            value={form.estimatedMinutes}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            required
          />

          <input
            name="imageUrl"
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />

          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            required
          >
            <option value="">
              Select category
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

          <div className="flex justify-end gap-3 pt-4">

            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border px-5 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 text-white"
            >
              Save
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default ServiceForm;