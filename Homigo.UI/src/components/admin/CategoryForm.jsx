import { useEffect, useState } from "react";

function CategoryForm({
  initialData,
  onSubmit,
  onCancel,
}) {
  const [form, setForm] = useState({
    name: "",
    icon: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        icon: initialData.icon ?? "",
      });
    } else {
      setForm({
        name: "",
        icon: "",
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
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">

        <h2 className="mb-6 text-3xl font-bold">
          {initialData ? "Edit Category" : "Add Category"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="mb-2 block font-medium">
              Category Name
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Cleaning"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Icon
            </label>

            <input
              name="icon"
              value={form.icon}
              onChange={handleChange}
              placeholder="🧹"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-slate-300 px-5 py-3 hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              {initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default CategoryForm;