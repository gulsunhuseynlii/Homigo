import { FaStar } from "react-icons/fa";

function ProviderCard({ provider, onClick, onViewProfile }) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

      <div className="relative">

        {provider.profileImageUrl ? (
          <img
            src={`https://localhost:7121${provider.profileImageUrl}`}
            alt={provider.fullName}
            className="h-60 w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-60 items-center justify-center bg-slate-100 text-6xl">
            👤
          </div>
        )}

        <div className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1 text-sm font-semibold shadow">
          ⭐ {provider.averageRating.toFixed(1)}
        </div>

      </div>

      <div className="p-5">

        <h2 className="text-xl font-bold">
          {provider.fullName}
        </h2>

        <p className="mt-1 text-sm text-blue-600">
          {provider.categoryName}
        </p>

        <p className="mt-2 text-sm text-gray-500">
          {provider.experience}
        </p>

        <p className="mt-4 line-clamp-2 text-sm text-slate-600">
          {provider.bio}
        </p>

        <div className="mt-6 flex gap-3">

          <button
            onClick={onViewProfile}
            className="flex-1 rounded-xl border border-blue-600 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            View Profile
          </button>

          <button
            onClick={onClick}
            className="flex-1 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Book Now
          </button>

        </div>

      </div>

    </div>
  );
}

export default ProviderCard;