import { FaArrowRight } from "react-icons/fa";

function AdminCard({
  title,
  description,
  icon,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-3xl bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="text-5xl">
        {icon}
      </div>

      <h2 className="mt-6 text-2xl font-bold">
        {title}
      </h2>

      <p className="mt-3 text-slate-500">
        {description}
      </p>

      <div className="mt-8 flex items-center justify-end gap-2 text-blue-600 font-semibold">
        Open
        <FaArrowRight />
      </div>
    </div>
  );
}

export default AdminCard;