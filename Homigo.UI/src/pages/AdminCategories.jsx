import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getCategories } from "../services/adminService";

function AdminCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      toast.error("Failed to load categories.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">
          Categories
        </h1>

        <button
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          + Add Category
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow">
        <table className="w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="p-4 text-left">Id</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Icon</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr
                key={category.id}
                className="border-t"
              >
                <td className="p-4">
                  {category.id}
                </td>

                <td className="p-4">
                  {category.name}
                </td>

                <td className="p-4">
                  {category.icon}
                </td>

                <td className="p-4 text-right">
                  <button className="mr-3 rounded bg-yellow-500 px-4 py-2 text-white">
                    Edit
                  </button>

                  <button className="rounded bg-red-600 px-4 py-2 text-white">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminCategories;