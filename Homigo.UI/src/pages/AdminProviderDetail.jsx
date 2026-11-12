import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaArrowLeft,
  FaStar,
  FaBriefcase,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

import { getProviderById } from "../services/providerService";

function AdminProviderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProvider();
  }, [id]);

  const loadProvider = async () => {
    try {
      setLoading(true);

      const data = await getProviderById(id);

      console.log("PROVIDER DETAIL:", data);

      setProvider(data);
    } catch (error) {
      console.error("Failed to load provider:", error);
      toast.error("Failed to load provider.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="text-lg font-semibold text-slate-500">
          Loading provider...
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800">
          Provider not found
        </h2>

        <button
          onClick={() => navigate("/admin/providers")}
          className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Back to Providers
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-10">

        {/* BACK */}

        <button
          onClick={() => navigate("/admin/providers")}
          className="mb-8 flex items-center gap-2 font-semibold text-slate-600 hover:text-blue-600"
        >
          <FaArrowLeft />
          Back to Providers
        </button>

        {/* HEADER */}

        <div className="overflow-hidden rounded-3xl bg-white shadow-lg">

          <div className="h-36 bg-gradient-to-r from-blue-600 to-blue-500" />

          <div className="px-8 pb-8">

            <div className="-mt-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

              <div className="flex items-end gap-5">

                {provider.profileImageUrl ? (
                  <img
                    src={`https://localhost:7121${provider.profileImageUrl}`}
                    alt={provider.fullName}
                    className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
                  />
                ) : (
                  <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-slate-200 text-4xl font-bold text-slate-600 shadow-lg">
                    {provider.fullName?.charAt(0)}
                  </div>
                )}

                <div className="pb-2">

                  <h1 className="text-3xl font-bold text-slate-900">
                    {provider.fullName}
                  </h1>

                  <p className="mt-1 font-medium text-blue-600">
                    {provider.categoryName}
                  </p>

                </div>

              </div>

            </div>

            {/* STATS */}

            <div className="mt-8 grid gap-4 md:grid-cols-4">

              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <FaStar className="text-xl text-yellow-500" />

                  <div>
                    <p className="text-2xl font-bold">
                      {Number(provider.averageRating ?? 0).toFixed(1)}
                    </p>

                    <p className="text-sm text-slate-500">
                      {provider.reviewCount ?? 0} reviews
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <FaBriefcase className="text-xl text-blue-600" />

                  <div>
                    <p className="text-2xl font-bold">
                      {provider.services?.length ?? 0}
                    </p>

                    <p className="text-sm text-slate-500">
                      Services
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <FaCheckCircle className="text-xl text-green-600" />

                  <div>
                    <p className="text-2xl font-bold">
                      {provider.completedOrders ?? 0}
                    </p>

                    <p className="text-sm text-slate-500">
                      Completed Orders
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <FaClock className="text-xl text-purple-600" />

                  <div>
                    <p className="text-2xl font-bold">
                      {provider.yearsOfExperience ?? 0}
                    </p>

                    <p className="text-sm text-slate-500">
                      Years Experience
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* INFORMATION */}

        <div className="mt-8 grid gap-8 lg:grid-cols-3">

          <div className="rounded-3xl bg-white p-8 shadow-sm lg:col-span-1">

            <h2 className="text-2xl font-bold text-slate-900">
              About Provider
            </h2>

            <div className="mt-6 space-y-5">

              <div>
                <p className="text-sm text-slate-400">
                  Email
                </p>

                <p className="mt-1 font-medium">
                  {provider.email || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">
                  Phone
                </p>

                <p className="mt-1 font-medium">
                  {provider.phoneNumber || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">
                  Experience
                </p>

                <p className="mt-1 font-medium">
                  {provider.experience ||
                    `${provider.yearsOfExperience ?? 0} years`}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">
                  Category
                </p>

                <p className="mt-1 font-medium">
                  {provider.categoryName}
                </p>
              </div>

            </div>

            {provider.bio && (
              <div className="mt-8 border-t pt-6">

                <p className="text-sm text-slate-400">
                  Bio
                </p>

                <p className="mt-2 leading-7 text-slate-600">
                  {provider.bio}
                </p>

              </div>
            )}

          </div>

          {/* SERVICES */}

          <div className="rounded-3xl bg-white p-8 shadow-sm lg:col-span-2">

            <div className="flex items-center justify-between">

              <h2 className="text-2xl font-bold text-slate-900">
                Services
              </h2>

              <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
                {provider.services?.length ?? 0} services
              </span>

            </div>

            {!provider.services ||
            provider.services.length === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                <p className="text-slate-500">
                  This provider has no services yet.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-4">

                {provider.services.map((service) => (

                  <div
                    key={service.id}
                    className="rounded-2xl border border-slate-200 p-5 transition hover:border-blue-300 hover:shadow-sm"
                  >

                    <div className="flex items-center justify-between gap-4">

                      <div>

                        <h3 className="text-lg font-bold text-slate-900">
                          {service.name}
                        </h3>

                        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                          {service.description}
                        </p>

                      </div>

                      <div className="shrink-0 text-right">

                        <p className="text-lg font-bold text-blue-600">
                          {service.basePrice} $
                        </p>

                        <p className="text-xs text-slate-400">
                          {service.estimatedMinutes} min
                        </p>

                      </div>

                    </div>

                  </div>

                ))}

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

export default AdminProviderDetail;