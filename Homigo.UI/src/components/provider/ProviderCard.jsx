import { FaStar } from "react-icons/fa";

function ProviderCard({ provider, onClick }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow transition hover:shadow-xl">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-xl font-bold">
            {provider.fullName}
          </h2>

          <p className="text-slate-500">
            {provider.experience}
          </p>

        </div>

        <div className="flex items-center gap-2 text-yellow-500">

          <FaStar />

          {provider.averageRating.toFixed(1)}

        </div>

      </div>

      <p className="mt-5 text-slate-600">
        {provider.bio}
      </p>

      <button
        onClick={onClick}
        className="mt-6 w-full rounded-xl bg-blue-600 py-3 text-white"
      >
        Book Now
      </button>

    </div>
  );
}

export default ProviderCard;