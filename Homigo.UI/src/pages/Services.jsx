import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Pagination from "../components/common/Pagination";
import Spinner from "../components/common/Spinner";
import { FiSearch, FiX } from "react-icons/fi";
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
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const role = getRole();

  const categoryId = searchParams.get("categoryId");

  useEffect(() => {
    setPage(1);
  }, [categoryId]);

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
        search,
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

  const handleSearch = (e) => {
  setSearch(e.target.value);
};
const handleSearchClick = () => {
  setPage(1);
  loadServices();
};
const clearSearch = () => {
  setSearch("");
  setPage(1);

  getServices({
    categoryId,
    page: 1,
    pageSize: 9,
  }).then((data) => {
    setServices(data.items);
    setTotalPages(data.totalPages);
  });
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

  <div className="mb-8 flex gap-3">
  <div className="relative flex-1">
    <input
      type="text"
      value={search}
      onChange={handleSearch}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleSearchClick();
        }
      }}
      placeholder="Search services..."
      className="w-full rounded-xl border border-slate-300 py-3 pl-4 pr-12 focus:border-blue-500 focus:outline-none"
    />

    {search && (
     <button
  onClick={clearSearch}
  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500"
>
  <FiX size={20} />
</button>
    )}
  </div>

  <button
  onClick={handleSearchClick}
  className="flex items-center justify-center rounded-xl bg-blue-600 px-6 text-white hover:bg-blue-700"
>
  <FiSearch size={22} />
</button>
</div>
            {services.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <div className="mb-4 text-6xl">🧹</div>

          <h2 className="text-2xl font-bold text-slate-800">
            No services found
          </h2>

          <p className="mt-2 text-slate-500">
            Try searching with another keyword.
          </p>
        </div>
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
                  className="rounded-xl border border-blue-600 px-5 py-2 text-blue-600 hover:bg-blue-50"
                >
                  View Details
                </button>

                {(role === "Customer" || !isAuthenticated()) && (
                  <button
                    onClick={() =>
                      handleChooseProvider(service.id)
                    }
                    className="rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                  >
                    Choose Provider
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10">
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

    </div>
  );
}

export default Services;