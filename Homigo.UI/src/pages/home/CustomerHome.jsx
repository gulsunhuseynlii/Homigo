import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getCategories } from "../../services/categoryService";
import CategoryCard from "../../components/category/CategoryCard";

function CustomerHome() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      toast.error("Failed to load categories.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Hero */}

      <section className="mx-auto max-w-7xl px-6 py-20">

        <div className="text-center">

          <h1 className="text-6xl font-extrabold text-slate-800">
            Find Trusted
            <span className="text-blue-600"> Home Services</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-xl text-slate-500">
            Book trusted professionals for cleaning, repair,
            plumbing, electrical work and much more.
          </p>

          <div className="mt-10 flex justify-center">

            <input
              placeholder="Search any service..."
              className="w-full max-w-xl rounded-xl border border-slate-300 bg-white px-6 py-4 shadow-sm outline-none focus:border-blue-500"
            />

          </div>

        </div>

      </section>

      {/* Stats */}

      <section className="mx-auto max-w-6xl px-6">

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

          <div className="rounded-2xl bg-white p-8 text-center shadow">

            <h2 className="text-4xl font-bold text-blue-600">
              15K+
            </h2>

            <p className="mt-2 text-slate-500">
              Happy Customers
            </p>

          </div>

          <div className="rounded-2xl bg-white p-8 text-center shadow">

            <h2 className="text-4xl font-bold text-blue-600">
              300+
            </h2>

            <p className="mt-2 text-slate-500">
              Professional Providers
            </p>

          </div>

          <div className="rounded-2xl bg-white p-8 text-center shadow">

            <h2 className="text-4xl font-bold text-blue-600">
              {categories.length}+
            </h2>

            <p className="mt-2 text-slate-500">
              Service Categories
            </p>

          </div>

        </div>

      </section>

      {/* Categories */}

      <section className="mx-auto max-w-7xl px-6 py-20">

        <h2 className="mb-10 text-4xl font-bold text-slate-800">
          Popular Categories
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">

          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={() =>
                navigate(`/services?categoryId=${category.id}`)
              }
            />
          ))}

        </div>

      </section>

    </div>
  );
}

export default CustomerHome;