import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import { getProviders } from "../services/providerService";
import ProviderCard from "../components/provider/ProviderCard";

function Providers() {
  const [providers, setProviders] = useState([]);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const serviceId = searchParams.get("serviceId");

  useEffect(() => {
    loadProviders();
  }, [serviceId]);

  const loadProviders = async () => {
    try {
      const data = await getProviders(serviceId);
      setProviders(data);
    } catch {
      toast.error("Failed to load providers.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">

      <h1 className="mb-8 text-4xl font-bold">
        Choose Provider
      </h1>

      {providers.length === 0 ? (
        <p>No providers found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {providers.map((provider) => (
            <ProviderCard
              key={provider.id}
              provider={provider}
              onClick={() =>
                navigate(
                  `/booking?serviceId=${serviceId}&providerId=${provider.id}`
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