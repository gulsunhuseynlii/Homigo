import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { getServiceById } from "../services/serviceService";
import { getRole } from "../utils/auth";
import Button from "../components/ui/Button";

function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const role = getRole();

  const [service, setService] = useState(null);

  useEffect(() => {
    loadService();
  }, [id]);

  const loadService = async () => {
    try {
      const data = await getServiceById(id);
      setService(data);
    } catch {
      toast.error("Failed to load service.");
    }
  };

  if (!service) {
    return (
      <div className="flex justify-center py-20">
        <h2 className="text-2xl font-semibold">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="rounded-3xl bg-white p-10 shadow-lg">

        <h1 className="text-4xl font-bold text-slate-800">
          {service.name}
        </h1>

        <p className="mt-5 text-lg text-slate-600">
          {service.description}
        </p>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">

          <div className="rounded-xl bg-slate-100 p-5">
            <p className="text-sm text-slate-500">
              Category
            </p>

            <h3 className="mt-2 text-xl font-semibold">
              {service.categoryName}
            </h3>
          </div>

          <div className="rounded-xl bg-slate-100 p-5">
            <p className="text-sm text-slate-500">
              Price
            </p>

            <h3 className="mt-2 text-xl font-semibold">
              {service.basePrice} ₼
            </h3>
          </div>

          <div className="rounded-xl bg-slate-100 p-5">
            <p className="text-sm text-slate-500">
              Duration
            </p>

            <h3 className="mt-2 text-xl font-semibold">
              {service.estimatedMinutes} min
            </h3>
          </div>

        </div>

        {role === "Customer" && (
          <div className="mt-10">
            <Button
              onClick={() =>
                navigate(`/providers?serviceId=${service.id}`)
              }
            >
              Choose Provider
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}

export default ServiceDetail;