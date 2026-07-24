import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getProviders } from "../services/providerService";

function AdminProviders() {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const data = await getProviders();
      setProviders(data.items ?? data);
    } catch {
      toast.error("Failed to load providers.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">
          Providers
        </h1>
      </div>

      {providers.length === 0 ? (
        <div className="rounded-2xl bg-slate-100 p-12 text-center">
          <p className="text-xl">
            No providers found.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="rounded-2xl border bg-white p-6 shadow"
            >
              <img
                src={`https://localhost:7121${provider.profileImageUrl}`}
                alt=""
                className="mb-4 h-24 w-24 rounded-full object-cover"
              />

              <h2 className="text-2xl font-bold">
                {provider.fullName}
              </h2>

              <p className="mt-2 text-slate-600">
                {provider.categoryName}
              </p>

              <p className="mt-2">
                ⭐ {provider.averageRating ?? 0}
              </p>

              <p>
                Services: {provider.serviceCount ?? 0}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminProviders;