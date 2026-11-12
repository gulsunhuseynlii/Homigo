import {
  FaMapMarkerAlt,
  FaTrash,
  FaEdit,
} from "react-icons/fa";

function AddressCard({ address, onEdit, onDelete }) {
  const hasCoordinates =
    address.latitude != null &&
    address.longitude != null;

  const hasAddress =
    address.city ||
    address.district ||
    address.street;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* HEADER */}
      <div className="flex items-start justify-between">

        <div>
          <h2 className="text-xl font-bold text-slate-800">
            {address.title || "Address"}
          </h2>

          {address.isDefault && (
            <span className="mt-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-600">
              Default
            </span>
          )}
        </div>

        <FaMapMarkerAlt
          size={22}
          className="text-blue-600"
        />

      </div>

      {/* ADDRESS */}
      <div className="mt-5 space-y-2 text-slate-600">

        {hasAddress ? (
          <>
            {(address.city || address.district) && (
              <p>
                📍{" "}
                {[address.city, address.district]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            )}

            {address.street && (
              <p>
                🛣️ {address.street}
              </p>
            )}

            {(address.building || address.apartment) && (
              <p>
                🏢{" "}
                {address.building &&
                  `Building ${address.building}`}

                {address.building &&
                  address.apartment &&
                  " / "}

                {address.apartment &&
                  `Apartment ${address.apartment}`}
              </p>
            )}
          </>
        ) : (
          <p className="text-orange-500">
            📍 Location selected on map
          </p>
        )}

        {/* COORDINATES */}
        {hasCoordinates && (
          <div className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
            <p>
              Latitude:{" "}
              {Number(address.latitude).toFixed(6)}
            </p>

            <p>
              Longitude:{" "}
              {Number(address.longitude).toFixed(6)}
            </p>
          </div>
        )}

        {/* NOTES */}
        {address.notes && (
          <p className="pt-2 text-sm text-slate-500">
            📝 {address.notes}
          </p>
        )}

      </div>

      {/* BUTTONS */}
      <div className="mt-6 flex gap-3">

        <button
          onClick={onEdit}
          className="flex items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 text-white transition hover:bg-yellow-600"
        >
          <FaEdit />
          Edit
        </button>

        <button
          onClick={onDelete}
          className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
        >
          <FaTrash />
          Delete
        </button>

      </div>

    </div>
  );
}

export default AddressCard;