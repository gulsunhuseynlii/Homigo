import {
  FaShieldAlt,
  FaClock,
  FaUserCheck,
  FaCreditCard,
} from "react-icons/fa";

function FeatureSection() {
  const features = [
    {
      icon: <FaUserCheck size={34} />,
      title: "Verified Professionals",
      description:
        "Every provider is reviewed before joining Homigo.",
    },
    {
      icon: <FaClock size={34} />,
      title: "Fast Booking",
      description:
        "Book trusted home services in just a few clicks.",
    },
    {
      icon: <FaCreditCard size={34} />,
      title: "Secure Payments",
      description:
        "Simple and secure payment process.",
    },
    {
      icon: <FaShieldAlt size={34} />,
      title: "Reliable Service",
      description:
        "Quality professionals you can trust.",
    },
  ];

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6">

        <h2 className="mb-12 text-center text-4xl font-bold">
          Why Choose Homigo?
        </h2>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-3xl bg-white p-8 text-center shadow transition hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mb-5 flex justify-center text-blue-600">
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold">
                {feature.title}
              </h3>

              <p className="mt-3 text-slate-500">
                {feature.description}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

export default FeatureSection;