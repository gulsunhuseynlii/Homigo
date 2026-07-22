function ServiceCard({
  service,
  onEdit,
  onDelete,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg">

      <div className="flex items-center justify-between">

        <h2 className="text-2xl font-bold">
          {service.name}
        </h2>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
          {service.categoryName}
        </span>

      </div>

      <p className="mt-4 text-slate-600">
        {service.description}
      </p>

      <div className="mt-5 space-y-2">

        <p>
          <strong>Price:</strong>{" "}
          {service.basePrice} ₼
        </p>

        <p>
          <strong>Duration:</strong>{" "}
          {service.estimatedMinutes} min
        </p>

      </div>

      <div className="mt-6 flex justify-end gap-3">

        <button
          onClick={() => onEdit(service)}
          className="rounded-lg border border-blue-600 px-4 py-2 text-blue-600 transition hover:bg-blue-50"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(service.id)}
          className="rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
        >
          Delete
        </button>

      </div>

    </div>
  );
}

export default ServiceCard;