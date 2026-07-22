function CategoryCard({
  category,
  onEdit,
  onDelete,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg transition">

      <div className="flex items-center justify-between">

        <div>
          <h2 className="text-2xl font-bold">
            {category.name}
          </h2>

          <p className="mt-2 text-slate-500">
            {category.icon || "No icon"}
          </p>
        </div>

      </div>

      <div className="mt-6 flex justify-end gap-3">

        <button
          onClick={() => onEdit(category)}
          className="rounded-lg border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-50"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(category.id)}
          className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Delete
        </button>

      </div>

    </div>
  );
}

export default CategoryCard;