import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { getServiceById } from "../services/serviceService";
import { getRole } from "../utils/auth";
import Button from "../components/ui/Button";
import { getServiceReviews } from "../services/reviewService";

function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const role = getRole();

  const [service, setService] = useState(null);

const [reviews, setReviews] = useState([]);
  useEffect(() => {
    loadService();
  }, [id]);

  const loadService = async () => {
  try {
    const data = await getServiceById(id);

    setService(data);

    const reviewData = await getServiceReviews(data.id);

    setReviews(reviewData);
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
            {/* Reviews */}

<div className="mt-14">
  <h2 className="mb-6 text-3xl font-bold">
    Customer Reviews
  </h2>

  {reviews.length === 0 ? (
    <div className="rounded-2xl bg-slate-100 p-8 text-center">
      <p className="text-slate-500">
        No reviews yet.
      </p>
    </div>
  ) : (
    <div className="space-y-5">

      {reviews.map((review) => (

        <div
          key={review.id}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >

          <div className="flex items-center justify-between">

            <div>
              <h3 className="text-lg font-semibold">
                {review.customerName}
              </h3>

              <p className="text-sm text-slate-500">
                {new Date(
                  review.createdAt
                ).toLocaleDateString()}
              </p>
            </div>

            <div className="text-yellow-500 text-xl">
              {"⭐".repeat(review.rating)}
            </div>

          </div>

          <p className="mt-4 text-slate-600">
            {review.comment}
          </p>

        </div>

      ))}

    </div>
  )}
</div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ServiceDetail;