import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Pagination from "../components/common/Pagination";
import Spinner from "../components/common/Spinner";
import { getServices } from "../services/serviceService";
import { getRole, isAuthenticated } from "../utils/auth";
import {
  addFavorite,
  removeFavorite,
  getMyFavorites,
} from "../services/favoriteService";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function Services() {
  const [services, setServices] = useState([]);

  const [searchParams] = useSearchParams();
const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const role = getRole();

  const categoryId = searchParams.get("categoryId");
useEffect(() => {
  setPage(1);
}, [categoryId]);
  const [favorites, setFavorites] = useState([]);
  const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);

 useEffect(() => {
  loadServices();

  if (isAuthenticated() && role === "Customer") {
    loadFavorites();
  }
}, [categoryId, page]);

 const loadServices = async () => {
  try {
    setLoading(true);

    const data = await getServices({
      categoryId,
      page,
      pageSize: 9,
    });

    setServices(data.items);
    setTotalPages(data.totalPages);
  } catch {
    toast.error("Failed to load services.");
  } finally {
    setLoading(false);
  }
};
const loadFavorites = async () => {
  try {
    const data = await getMyFavorites();

    setFavorites(data.map((x) => x.serviceId));
  } catch {}
};
const toggleFavorite = async (serviceId) => {
  try {
    if (favorites.includes(serviceId)) {
      await removeFavorite(serviceId);

      setFavorites((prev) =>
        prev.filter((id) => id !== serviceId)
      );

      toast.success("Removed from favorites.");
    } else {
      await addFavorite(serviceId);

      setFavorites((prev) => [...prev, serviceId]);

      toast.success("Added to favorites.");
    }
  } catch {
    toast.error("Operation failed.");
  }
};
const handleChooseProvider = (serviceId) => {
  if (!isAuthenticated()) {
    toast("Please login to book a service.");
    navigate("/login");
    return;
  }

  navigate(`/providers?serviceId=${serviceId}`);
};

if (loading) {
  return <Spinner />;
}

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-8 text-4xl font-bold">
        {categoryId ? "Category Services" : "All Services"}
      </h1>

      {services.length === 0 ? (
        <p>No services found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
           <div
  key={service.id}
  className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow transition hover:shadow-xl"
>
              {service.imageUrl && (
  <img
    src={`https://localhost:7121${service.imageUrl}`}
    alt={service.name}
    className="mb-4 h-52 w-full rounded-xl object-cover"
  />
)}
{role === "Customer" && (
  <button
    onClick={() => toggleFavorite(service.id)}
    className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md transition-all duration-200 hover:scale-110 hover:shadow-lg"
    title={
      favorites.includes(service.id)
        ? "Remove from favorites"
        : "Add to favorites"
    }
  >
    {favorites.includes(service.id) ? (
      <FaHeart className="text-xl text-red-500" />
    ) : (
      <FaRegHeart className="text-xl text-gray-500" />
    )}
  </button>
)}
              <h2 className="text-2xl font-bold">
                {service.name}
              </h2>

              <p className="mt-3 text-slate-600">
                {service.description}
              </p>

              <div className="mt-5 space-y-2">
                <p>
                  <strong>Price:</strong> {service.basePrice} ₼
                </p>

                <p>
                  <strong>Duration:</strong> {service.estimatedMinutes} min
                </p>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => navigate(`/services/${service.id}`)}
                  className="rounded-xl border border-blue-600 px-5 py-2 text-blue-600 transition hover:bg-blue-50"
                >
                  View Details
                </button>

                {(role === "Customer" || !isAuthenticated()) && (
                  <button
                    onClick={() => handleChooseProvider(service.id)}
                    className="rounded-xl bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700"
                  >
                    Choose Provider
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
            )}

     <Pagination
  page={page}
  totalPages={totalPages}
  onPageChange={setPage}
/>
    </div>
  );
}

export default Services;