import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import Spinner from "../components/common/Spinner";
import { getProviders } from "../services/providerService";
import ProviderCard from "../components/provider/ProviderCard";

function Providers() {
const [providers, setProviders] = useState([]);
const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const serviceId = searchParams.get("serviceId");

  useEffect(() => {
    loadProviders();
  }, [serviceId]);

const loadProviders = async () => {
  try {
    setLoading(true);

    const data = await getProviders(serviceId);

    console.log(data);

    setProviders(data);
  } catch (error) {
    console.log(error.response);

    toast.error("Failed to load providers.");
  } finally {
    setLoading(false);
  }
};
if (loading) {
  return <Spinner />;
}
  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <h1 className="mb-8 text-4xl font-bold">
        Choose Provider
      </h1>

     {providers.length === 0 ? (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
    <div className="mb-4 text-6xl">👨‍🔧</div>

    <h2 className="text-2xl font-bold text-slate-800">
      No providers found
    </h2>

    <p className="mt-2 text-slate-500">
      Try selecting another service or check back later.
    </p>
  </div>
) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {providers.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              onClick={() =>
                navigate(
                  `/booking?serviceId=${serviceId}&providerId=${provider.userId}`
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Providers;