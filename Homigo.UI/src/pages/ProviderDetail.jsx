import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../components/common/Spinner";
import toast from "react-hot-toast";
import { getProviderById } from "../services/providerService";
import { useNavigate } from "react-router-dom";

function ProviderDetail() {
const navigate = useNavigate();
const { id } = useParams();

const [provider, setProvider] = useState(null);
const [loading, setLoading] = useState(true);
useEffect(() => {
  loadProvider();
}, [id]);

const loadProvider = async () => {
  try {
    setLoading(true);

    const data = await getProviderById(id);

    setProvider(data);
  } catch {
    toast.error("Failed to load provider.");
  } finally {
    setLoading(false);
  }
};if (loading) {
  return <Spinner />;
}

if (!provider) {
  return null;
}
return (
  <div className="mx-auto max-w-7xl px-6 py-10">

    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">

      <div className="h-48 bg-gradient-to-r from-blue-600 to-cyan-500"></div>

      <div className="-mt-20 px-8 pb-8">

        <div className="flex flex-col gap-8 lg:flex-row">

          <div className="shrink-0">
            {provider.profileImageUrl ? (
              <img
                src={`https://localhost:7121${provider.profileImageUrl}`}
                alt={provider.fullName}
                className="h-40 w-40 rounded-full border-4 border-white object-cover shadow-lg"
              />
            ) : (
              <div className="flex h-40 w-40 items-center justify-center rounded-full border-4 border-white bg-slate-100 text-6xl shadow-lg">
                👤
              </div>
            )}
          </div>

          <div className="flex-1">

            <div className="flex flex-wrap items-center justify-between gap-4">

              <div>
                <h1 className="text-4xl font-bold">
                  {provider.fullName}
                </h1>

                <p className="mt-2 text-lg text-blue-600">
                  {provider.categoryName}
                </p>

                <p className="mt-1 text-slate-500">
                  {provider.experience}
                </p>
              </div>

              <button
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Book This Provider
              </button>

            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">

              <div className="rounded-2xl bg-slate-50 p-5 text-center">
                <p className="text-3xl font-bold text-yellow-500">
                  ⭐ {provider.averageRating.toFixed(1)}
                </p>

                <p className="mt-2 text-slate-500">
                  Average Rating
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 text-center">
                <p className="text-3xl font-bold">
                  {provider.reviewCount}
                </p>

                <p className="mt-2 text-slate-500">
                  Reviews
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5 text-center">
                <p className="text-3xl font-bold">
                  {provider.completedOrders}
                </p>

                <p className="mt-2 text-slate-500">
                  Completed Jobs
                </p>
              </div>

            </div>

            <div className="mt-10">

              <h2 className="mb-3 text-2xl font-bold">
                About
              </h2>

              <p className="leading-8 text-slate-600">
                {provider.bio}
              </p>

            </div>

            <div className="mt-10">

              <h2 className="mb-4 text-2xl font-bold">
                Services
              </h2>

              <div className="flex flex-wrap gap-3">

                {provider.services?.map((service) => (
  <button
    key={service.id}
    onClick={() => navigate(`/services/${service.id}`)}
    className="rounded-full bg-blue-100 px-4 py-2 font-medium text-blue-700 transition hover:bg-blue-600 hover:text-white"
  >
    {service.name}
  </button>
))}

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>
);
}

export default ProviderDetail;