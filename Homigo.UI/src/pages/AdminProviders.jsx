import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getProviders } from "../services/providerService";
import {
  FiBriefcase,
  FiStar,
  FiChevronRight,
} from "react-icons/fi";

function AdminProviders() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      setLoading(true);

      const data = await getProviders();

      setProviders(data.items ?? data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load providers.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* HEADER */}

        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Administration
          </p>

          <h1 className="mt-2 text-4xl font-extrabold text-slate-900">
            Providers
          </h1>

          <p className="mt-2 text-slate-500">
            Manage approved service providers on Homigo.
          </p>
        </div>

        {/* EMPTY */}

        {providers.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center">
            <div className="text-6xl">
              👨‍🔧
            </div>

            <h2 className="mt-5 text-2xl font-bold text-slate-800">
              No providers found
            </h2>

            <p className="mt-2 text-slate-500">
              There are currently no approved providers.
            </p>
          </div>
        ) : (

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {providers.map((provider) => {

              const rating =
                provider.averageRating ?? 0;

              const reviewCount =
                provider.reviewCount ?? 0;

              const serviceCount =
                provider.services?.length ?? 0;

              return (
                <div
                  key={provider.id}
                  onClick={() =>
                    navigate(
                      `/admin/providers/${provider.userId}`
                    )
                  }
                  className="group cursor-pointer overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                >

                  {/* TOP */}

                  <div className="relative h-28 bg-gradient-to-r from-blue-600 to-blue-500">

                    <div className="absolute -bottom-12 left-6">

                      {provider.profileImageUrl ? (
                        <img
                          src={`https://localhost:7121${provider.profileImageUrl}`}
                          alt={provider.fullName}
                          className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg"
                        />
                      ) : (
                        <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-slate-100 text-3xl font-bold text-blue-600 shadow-lg">
                          {provider.fullName
                            ?.charAt(0)
                            .toUpperCase()}
                        </div>
                      )}

                    </div>

                  </div>

                  {/* BODY */}

                  <div className="px-6 pb-6 pt-16">

                    <div className="flex items-start justify-between gap-4">

                      <div>
                        <h2 className="text-xl font-bold text-slate-900">
                          {provider.fullName}
                        </h2>

                        <p className="mt-1 text-sm font-medium text-blue-600">
                          {provider.categoryName}
                        </p>
                      </div>

                      <div className="rounded-full bg-slate-100 p-2 text-slate-500 transition group-hover:bg-blue-50 group-hover:text-blue-600">
                        <FiChevronRight size={20} />
                      </div>

                    </div>

                    {/* STATS */}

                    <div className="mt-6 grid grid-cols-2 gap-3">

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <div className="flex items-center gap-2 text-yellow-500">
                          <FiStar
                            className="fill-current"
                            size={18}
                          />

                          <span className="font-bold">
                            {rating.toFixed(1)}
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-slate-500">
                          {reviewCount} reviews
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">

                        <div className="flex items-center gap-2 text-blue-600">
                          <FiBriefcase size={18} />

                          <span className="font-bold">
                            {serviceCount}
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-slate-500">
                          Services
                        </p>

                      </div>

                    </div>

                    {/* BUTTON */}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();

                        navigate(
                          `/admin/providers/${provider.userId}`
                        );
                      }}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 font-semibold text-white transition hover:bg-blue-600"
                    >
                      View Provider
                      <FiChevronRight />
                    </button>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
}

export default AdminProviders;