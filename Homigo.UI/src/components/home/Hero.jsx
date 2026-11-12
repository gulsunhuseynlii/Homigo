import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getServices } from "../../services/serviceService";
import Spinner from "../common/Spinner";

function Hero() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);

      const data = await getServices({
        page: 1,
        pageSize: 3,
      });

      const serviceList = data?.items ?? data ?? [];

      setServices(serviceList.slice(0, 3));
    } catch (error) {
      console.error("HERO SERVICES ERROR:", error);

      toast.error("Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* HERO */}

      <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white">

        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-2 lg:items-center">

          {/* LEFT SIDE */}

          <div>

            {/* BADGE */}

            <span className="inline-block rounded-full bg-blue-800 px-4 py-2 text-sm font-semibold">
              Trusted Home Services
            </span>

            {/* TITLE */}

            <h1 className="mt-6 text-5xl font-bold leading-tight">
              Find Trusted
              <br />
              Home Services
            </h1>

            {/* DESCRIPTION */}

            <p className="mt-6 max-w-xl text-lg leading-8 text-blue-100">
              Discover trusted professionals for cleaning,
              plumbing, electrical work, transportation,
              beauty services and much more.
            </p>

            {/* STATS */}

            <div className="mt-10 flex gap-10">

              <div>
                <div className="text-3xl font-bold">
                  15+
                </div>

                <div className="text-sm text-blue-100">
                  Categories
                </div>
              </div>

              <div>
                <div className="text-3xl font-bold">
                  500+
                </div>

                <div className="text-sm text-blue-100">
                  Providers
                </div>
              </div>

              <div>
                <div className="text-3xl font-bold">
                  2000+
                </div>

                <div className="text-sm text-blue-100">
                  Completed Orders
                </div>
              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}

          <div className="hidden lg:flex lg:justify-center">

            <div className="flex h-[410px] w-[380px] items-center justify-center rounded-3xl bg-white/10">

              <div className="text-8xl">
                🏠
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* POPULAR SERVICES */}

      <section className="bg-slate-50 py-14">

        <div className="mx-auto max-w-6xl px-6">

          {/* HEADER */}

          <div className="mb-8 flex items-center justify-between">

            <div>

              <h2 className="text-3xl font-bold text-slate-900">
                Popular Services
              </h2>

              <p className="mt-2 text-slate-500">
                Explore services from trusted providers.
              </p>

            </div>

            <button
              onClick={() => navigate("/services")}
              className="font-semibold text-blue-600 transition hover:text-blue-700"
            >
              View all →
            </button>

          </div>


          {/* LOADING */}

          {loading ? (

            <div className="flex justify-center py-16">
              <Spinner />
            </div>

          ) : services.length === 0 ? (

            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">

              <div className="text-5xl">
                🛠️
              </div>

              <h3 className="mt-4 text-xl font-bold text-slate-800">
                No services available
              </h3>

            </div>

          ) : (

            /* SERVICES */

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

              {services.map((service) => (

                <div
                  key={service.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >

                  {/* IMAGE */}

                  <div className="h-52 w-full overflow-hidden bg-slate-100">

                    {service.imageUrl ? (

                      <img
                        src={
                          service.imageUrl.startsWith("http")
                            ? service.imageUrl
                            : `https://localhost:7121${service.imageUrl}`
                        }
                        alt={service.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />

                    ) : (

                      <div className="flex h-full items-center justify-center text-6xl">
                        🛠️
                      </div>

                    )}

                  </div>


                  {/* CONTENT */}

                  <div className="p-5">

                    <h3 className="line-clamp-1 text-xl font-bold text-slate-900">
                      {service.name}
                    </h3>

                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                      {service.description}
                    </p>


                    {/* PRICE + DURATION */}

                    <div className="mt-5 flex items-center justify-between">

                      <div>

                        <p className="text-xs uppercase tracking-wide text-slate-400">
                          Starting from
                        </p>

                        <p className="text-2xl font-extrabold text-blue-600">
                          {service.basePrice} ₼
                        </p>

                      </div>


                      {service.estimatedMinutes && (

                        <div className="rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-600">
                          ⏱ {service.estimatedMinutes} min
                        </div>

                      )}

                    </div>


                    {/* BUTTON */}

                    <button
                      onClick={() =>
                        navigate(`/services/${service.id}`)
                      }
                      className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                      View Service
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </section>
    </>
  );
}

export default Hero;