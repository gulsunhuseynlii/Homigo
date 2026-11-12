import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/adminService";

import CategoryForm from "../components/admin/CategoryForm";

function AdminCategories() {
  const [categories, setCategories] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Delete modal
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleAdd = () => {
    setSelectedCategory(null);
    setIsOpen(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setIsOpen(true);
  };

  // Open delete modal
  const handleDeleteClick = (id) => {
    setDeleteCategoryId(id);
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    if (!deleteCategoryId) return;

    try {
      setDeleting(true);

      await deleteCategory(deleteCategoryId);

      toast.success("Category deleted.");

      setDeleteCategoryId(null);

      await loadCategories();
    } catch {
      toast.error("Failed to delete category.");
    } finally {
      setDeleting(false);
    }
  };

  // Close delete modal
  const handleDeleteClose = () => {
    if (deleting) return;

    setDeleteCategoryId(null);
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedCategory) {
        await updateCategory(
          selectedCategory.id,
          formData
        );

        toast.success("Category updated.");
      } else {
        await createCategory(formData);

        toast.success("Category created.");
      }

      setIsOpen(false);
      setSelectedCategory(null);

      await loadCategories();
    } catch {
      toast.error("Operation failed.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">

      {/* Header */}

      <div className="mb-8 flex items-center justify-between">

        <h1 className="text-4xl font-bold">
          Categories
        </h1>

        <button
          onClick={handleAdd}
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          + Add Category
        </button>

      </div>


      {/* Categories table */}

      <div className="overflow-hidden rounded-2xl bg-white shadow">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="p-4 text-left">
                Id
              </th>

              <th className="p-4 text-left">
                Name
              </th>

              <th className="p-4 text-left">
                Icon
              </th>

              <th className="p-4 text-right">
                Actions
              </th>

            </tr>

          </thead>


          <tbody>

            {categories.map((category, index) => (

              <tr
                key={category.id}
                className="border-t"
              >

                <td className="p-4">
                  {index + 1}
                </td>

                <td className="p-4 font-medium">
                  {category.name}
                </td>

                <td className="p-4">
                  {category.icon}
                </td>

                <td className="p-4 text-right">

                  <button
                    onClick={() =>
                      handleEdit(category)
                    }
                    className="mr-3 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-yellow-600"
                  >
                    Edit
                  </button>


                  <button
                    onClick={() =>
                      handleDeleteClick(category.id)
                    }
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>


      {/* Category Form */}

      {isOpen && (

        <CategoryForm
          initialData={selectedCategory}

          onSubmit={handleSubmit}

          onCancel={() => {
            setIsOpen(false);
            setSelectedCategory(null);
          }}
        />

      )}


      {/* Delete Confirmation Modal */}

      {deleteCategoryId && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl">

            {/* Icon */}

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl">
              ⚠️
            </div>


            {/* Title */}

            <h2 className="mt-5 text-center text-2xl font-bold text-slate-800">
              Delete Category?
            </h2>


            {/* Description */}

            <p className="mt-3 text-center text-slate-500">
              Are you sure you want to delete this category?
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
                Keep Category
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

export default AdminCategories;