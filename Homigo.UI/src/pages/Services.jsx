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
import {
  FiSearch,
  FiX,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState("");
const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");
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
}, [categoryId, page, sort]);
 const loadServices = async (filters = {}) => {
  try {
    setLoading(true);

    const data = await getServices({
      categoryId,
      search,
      sort,
      minPrice: filters.minPrice ?? minPrice,
      maxPrice: filters.maxPrice ?? maxPrice,
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

 {/* Search */}
<div className="mb-8">
  <div className="flex gap-3">
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
        className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-4 pr-12 shadow-sm focus:border-blue-500 focus:outline-none"
      />

      {search && (
        <button
          onClick={clearSearch}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500"
        >
          <FiX size={20} />
        </button>
      )}
    </div>

    <button
      onClick={handleSearchClick}
      className="rounded-xl bg-blue-600 px-6 text-white shadow hover:bg-blue-700"
    >
      <FiSearch size={22} />
    </button>
  </div>
</div>

{/* Filter + Sort */}
<div className="relative mb-4 flex items-center justify-between">

  <button
    onClick={() => setShowFilters(!showFilters)}
    className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 shadow-sm hover:bg-slate-50"
  >
    <FiFilter />
    Filters
    {showFilters ? <FiChevronUp /> : <FiChevronDown />}
  </button>

  <select
    value={sort}
    onChange={(e) => {
      setSort(e.target.value);
      setPage(1);
    }}
    className="w-60 rounded-xl border border-slate-300 bg-white px-4 py-2 shadow-sm"
  >
    <option value="">Sort by</option>
    <option value="recommended">⭐ Highly Recommended</option>
    <option value="priceAsc">Price: Low to High</option>
    <option value="priceDesc">Price: High to Low</option>
  </select>

 {showFilters && (
  <div className="absolute left-0 top-full mt-3 z-50 w-80 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">

    <div className="mb-5 flex items-center justify-between">
      <h3 className="text-lg font-semibold text-slate-800">
        Price Range
      </h3>

      <button
        onClick={() => setShowFilters(false)}
        className="text-xl text-slate-400 hover:text-red-500"
      >
        ✕
      </button>
    </div>

    <div className="grid grid-cols-2 gap-4">

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600">
          Min Price
        </label>

        <div className="relative">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="0"
            className="w-full rounded-xl border border-slate-300 py-3 pl-4 pr-8 focus:border-blue-500 focus:outline-none"
          />

          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            ₼
          </span>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-600">
          Max Price
        </label>

        <div className="relative">
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="1000"
            className="w-full rounded-xl border border-slate-300 py-3 pl-4 pr-8 focus:border-blue-500 focus:outline-none"
          />

          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            ₼
          </span>
        </div>
      </div>

    </div>

    <div className="mt-6 flex gap-3">

      <button
        onClick={() => {
          setMinPrice("");
          setMaxPrice("");
          setPage(1);
          loadServices();
          setShowFilters(false);
        }}
        className="flex-1 rounded-xl border border-slate-300 py-3 font-medium transition hover:bg-slate-100"
      >
        Reset
      </button>

      <button
        onClick={() => {
          setPage(1);
          loadServices();
          setShowFilters(false);
        }}
        className="flex-1 rounded-xl bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700"
      >
        Apply
      </button>

    </div>
  </div>
)}

  
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
  <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
    {services.map((service) => (
      <div
        key={service.id}
        className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
      >
        <div className="relative">
          {service.imageUrl && (
            <img
              src={`https://localhost:7121${service.imageUrl}`}
              alt={service.name}
              className="h-60 w-full object-cover transition duration-500 group-hover:scale-105"
            />
          )}

          {role === "Customer" && (
            <button
              onClick={() => toggleFavorite(service.id)}
              className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition hover:scale-110"
            >
              {favorites.includes(service.id) ? (
                <FaHeart className="text-red-500 text-xl" />
              ) : (
                <FaRegHeart className="text-gray-500 text-xl" />
              )}
            </button>
          )}

          {service.reviewCount > 0 && (
            <div className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1 text-sm font-semibold shadow">
              ⭐ {service.averageRating.toFixed(1)}
              <span className="ml-1 text-gray-500">
                ({service.reviewCount})
              </span>
            </div>
          )}
        </div>

        <div className="p-5">
          <h2 className="line-clamp-1 text-xl font-bold">
            {service.name}
          </h2>

          <p className="mt-2 line-clamp-2 text-sm text-slate-600">
            {service.description}
          </p>

          <div className="mt-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Starting From
              </p>

              <p className="text-3xl font-extrabold text-blue-600">
                {service.basePrice} ₼
              </p>
            </div>

            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium">
              ⏱ {service.estimatedMinutes} min
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => navigate(`/services/${service.id}`)}
              className="flex-1 rounded-xl border border-blue-600 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
            >
              View Details
            </button>

            {(role === "Customer" || !isAuthenticated()) && (
              <button
                onClick={() =>
                  handleChooseProvider(service.id)
                }
                className="flex-1 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Book Now
              </button>
            )}
          </div>
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