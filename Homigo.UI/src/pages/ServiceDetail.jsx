import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { getServiceById } from "../services/serviceService";
import { getRole, isAuthenticated } from "../utils/auth";
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

      // Reviews ayrı yüklənir.
      // Review API işləməsə belə service səhifəsi açılacaq.
      try {
        const reviewData = await getServiceReviews(data.id);
        setReviews(reviewData);
      } catch (error) {
        console.error("Failed to load reviews:", error);
        setReviews([]);
      }
    } catch (error) {
      console.error("Failed to load service:", error);
      toast.error("Failed to load service.");
    }
  };

  if (!service) {
    return (
      <div className="flex justify-center py-20">
        <h2 className="text-2xl font-semibold">
          Loading...
        </h2>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">

      {/* SERVICE DETAILS */}
      <div className="rounded-3xl bg-white p-10 shadow-lg">

        <h1 className="text-4xl font-bold text-slate-800">
          {service.name}
        </h1>

        <p className="mt-5 text-lg leading-8 text-slate-600">
          {service.description}
        </p>

        {/* INFO */}
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
              {service.basePrice} $
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

        {/* BOOKING BUTTON */}
        <div className="mt-10 flex gap-4">

          {role === "Customer" ? (
            <Button
              onClick={() =>
                navigate(
                  `/providers?serviceId=${service.id}`
                )
              }
            >
              Choose Provider
            </Button>
          ) : !isAuthenticated() ? (
            <Button
              onClick={() => navigate("/login")}
            >
              Login to Book
            </Button>
          ) : null}

        </div>

      </div>

      {/* REVIEWS */}
      <div className="mt-12 rounded-3xl bg-white p-10 shadow-lg">

        <div className="mb-6 flex items-center justify-between">

          <h2 className="text-3xl font-bold text-slate-800">
            Customer Reviews
          </h2>

          {reviews.length > 0 && (
            <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">
              ⭐ {reviews.length} review
              {reviews.length !== 1 ? "s" : ""}
            </span>
          )}

        </div>

        {reviews.length === 0 ? (

          <div className="rounded-2xl bg-slate-100 p-10 text-center">

            <div className="mb-4 text-5xl">
              ⭐
            </div>

            <h3 className="text-xl font-semibold text-slate-800">
              No reviews yet
            </h3>

            <p className="mt-2 text-slate-500">
              Be the first customer to review this service.
            </p>

          </div>

        ) : (

          <div className="space-y-5">

            {reviews.map((review) => (

              <div
                key={review.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
              >

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <h3 className="text-lg font-semibold text-slate-800">
                      {review.customerName}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {new Date(
                        review.createdAt
                      ).toLocaleDateString()}
                    </p>

                  </div>

                  <div className="text-lg text-yellow-500">
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
  );
}

export default ServiceDetail;   