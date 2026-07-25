import { Link } from "react-router-dom";

function ProviderCTA() {
  return (
    <section className="bg-blue-600 py-20 text-white">

      <div className="mx-auto max-w-5xl px-6 text-center">

        <h2 className="text-5xl font-bold">
          Become a Homigo Provider
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
          Join thousands of professionals and grow your business
          by reaching more customers every day.
        </p>

        <Link
          to="/become-provider"
          className="mt-10 inline-block rounded-xl bg-white px-8 py-4 text-lg font-semibold text-blue-600 transition hover:scale-105"
        >
          Apply Now
        </Link>

      </div>

    </section>
  );
}

export default ProviderCTA;