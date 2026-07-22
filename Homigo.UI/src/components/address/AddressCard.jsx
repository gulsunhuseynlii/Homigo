import { FaMapMarkerAlt, FaTrash, FaEdit } from "react-icons/fa";

function AddressCard({ address, onEdit, onDelete }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-xl font-bold">
            {address.title}
          </h2>

          {address.isDefault && (
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-600">
              Default
            </span>
          )}

        </div>

        <FaMapMarkerAlt
          size={22}
          className="text-blue-600"
        />

      </div>

      <div className="mt-5 space-y-2 text-slate-600">

        <p>
          {address.city}, {address.district}
        </p>

        <p>
          {address.street}
        </p>

        <p>
          Building {address.building} / Apartment {address.apartment}
        </p>

        {address.notes && (
          <p>{address.notes}</p>
        )}

      </div>

      <div className="mt-6 flex gap-3">

        <button
          onClick={onEdit}
          className="flex items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 text-white"
        >
          <FaEdit />
          Edit
        </button>

        <button
          onClick={onDelete}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white"
        >
          <FaTrash />
          Delete
        </button>

      </div>

    </div>
  );
}

export default AddressCard;