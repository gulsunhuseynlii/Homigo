import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getMyFavorites,
  removeFavorite,
} from "../services/favoriteService";

import Spinner from "../components/common/Spinner";

function MyFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);

      const data = await getMyFavorites();

      setFavorites(data);
    } catch {
      toast.error("Failed to load favorites.");
    } finally {
      setLoading(false);
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

  // LOADING
  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">

      {/* HEADER */}
      <h1 className="mb-8 text-4xl font-bold">
        ❤️ My Favorites
      </h1>

      {/* EMPTY */}
      {favorites.length === 0 ? (
        <div className="rounded-2xl bg-slate-100 p-10 text-center">

          <div className="mb-4 text-5xl">
            ❤️
          </div>

          <h2 className="text-2xl font-semibold text-slate-800">
            No favorite services yet
          </h2>

          <p className="mt-2 text-slate-500">
            Services you add to favorites will appear here.
          </p>

        </div>
      ) : (

        /* FAVORITES */
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {favorites.map((service) => (

            <div
              key={service.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow transition hover:-translate-y-1 hover:shadow-lg"
            >

              {/* SERVICE NAME */}
              <h2 className="text-2xl font-bold text-slate-900">
                {service.serviceName}
              </h2>

              {/* CATEGORY */}
              <p className="mt-3 text-slate-600">
                <strong>Category:</strong>{" "}
                {service.categoryName}
              </p>

              {/* PRICE */}
              <p className="mt-2 text-slate-600">
                <strong>Price:</strong>{" "}
                {service.basePrice} $
              </p>

              {/* BUTTONS */}
              <div className="mt-6 flex gap-3">

                <button
                  onClick={() =>
                    navigate(`/services/${service.serviceId}`)
                  }
                  className="rounded-lg border border-blue-600 px-4 py-2 font-medium text-blue-600 transition hover:bg-blue-50"
                >
                  View
                </button>

                <button
                  onClick={() =>
                    handleRemove(service.serviceId)
                  }
                  className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700"
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