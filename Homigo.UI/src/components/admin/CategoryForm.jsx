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
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">

      <div className="w-full max-w-md rounded-2xl bg-white p-8">

        <h2 className="mb-6 text-3xl font-bold">
          {initialData ? "Edit Category" : "Add Category"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            className="w-full rounded-lg border p-3"
            required
          />

          <input
            placeholder="Icon"
            value={form.icon}
            onChange={(e) =>
              setForm({
                ...form,
                icon: e.target.value,
              })
            }
            className="w-full rounded-lg border p-3"
          />

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border px-5 py-2"
            >
              Cancel
            </button>

            <button
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

export default CategoryForm;