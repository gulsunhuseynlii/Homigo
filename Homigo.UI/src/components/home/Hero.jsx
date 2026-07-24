import { Search } from "lucide-react";

function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 px-6 py-20 lg:flex-row">

        {/* Left */}

        <div className="flex-1">

          <span className="rounded-full bg-blue-800 px-4 py-2 text-sm font-medium">
            Trusted Home Services
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-tight lg:text-6xl">
            Find Trusted
            <br />
            Home Services
          </h1>

          <p className="mt-6 max-w-xl text-lg text-blue-100">
            Discover trusted professionals for cleaning,
            plumbing, electrical work, transportation,
            beauty services and much more.
          </p>

          <div className="mt-10 flex overflow-hidden rounded-2xl bg-white shadow-xl">

            <input
              type="text"
              placeholder="Search services..."
              className="w-full px-6 py-4 text-gray-700 outline-none"
            />

            <button className="bg-blue-600 px-6 transition hover:bg-blue-700">
              <Search size={24} />
            </button>

          </div>

          <div className="mt-12 flex flex-wrap gap-10">

            <div>
              <h2 className="text-3xl font-bold">15+</h2>
              <p className="text-blue-100">Categories</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold">500+</h2>
              <p className="text-blue-100">Providers</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold">2000+</h2>
              <p className="text-blue-100">Completed Orders</p>
            </div>

          </div>

        </div>

        {/* Right */}

        <div className="flex flex-1 justify-center">

          <div className="flex h-[480px] w-full max-w-md items-center justify-center rounded-3xl bg-white/10 backdrop-blur">

            <span className="text-8xl">
              🏠
            </span>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Hero;