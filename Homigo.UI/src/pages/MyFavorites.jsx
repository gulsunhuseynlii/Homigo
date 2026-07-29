import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getMyFavorites,
  removeFavorite,
} from "../services/favoriteService";

function MyFavorites() {
  const [favorites, setFavorites] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const data = await getMyFavorites();

      setFavorites(data);
    } catch {
      toast.error("Failed to load favorites.");
    }
  };

  const handleRemove = async (serviceId) => {
    try {
      await removeFavorite(serviceId);

      toast.success("Removed from favorites.");

      loadFavorites();
    } catch {
      toast.error("Failed to remove favorite.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">

      <h1 className="mb-8 text-4xl font-bold">
        ❤️ My Favorites
      </h1>

      {favorites.length === 0 ? (
        <div className="rounded-2xl bg-slate-100 p-10 text-center">
          <h2 className="text-2xl font-semibold">
            No favorite services yet
          </h2>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {favorites.map((service) => (

            <div
              key={service.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow"
            >
              <h2 className="text-2xl font-bold">
                {service.serviceName}
              </h2>

              <p className="mt-3">
                <strong>Category:</strong>{" "}
                {service.categoryName}
              </p>

              <p className="mt-2">
                <strong>Price:</strong>{" "}
                {service.basePrice} ₼
              </p>

              <div className="mt-6 flex gap-3">

                <button
                  onClick={() =>
                    navigate(`/services/${service.serviceId}`)
                  }
                  className="rounded-lg border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-50"
                >
                  View
                </button>

                <button
                  onClick={() =>
                    handleRemove(service.serviceId)
                  }
                  className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                >
                  Remove
                </button>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default MyFavorites;