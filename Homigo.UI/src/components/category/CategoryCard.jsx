import { useNavigate } from "react-router-dom";
import {
  FaBroom,
  FaBolt,
  FaFaucet,
  FaPaintRoller,
  FaTruckMoving,
  FaLeaf,
  FaHouse,
} from "react-icons/fa6";

function CategoryCard({ category }) {
  const navigate = useNavigate();

  const getIcon = (name) => {
    switch (name.toLowerCase()) {
      case "cleaning":
        return <FaBroom size={34} />;

      case "electrical":
        return <FaBolt size={34} />;

      case "plumbing":
        return <FaFaucet size={34} />;

      case "painting":
        return <FaPaintRoller size={34} />;

      case "moving":
        return <FaTruckMoving size={34} />;

      case "gardening":
        return <FaLeaf size={34} />;

      default:
        return <FaHouse size={34} />;
    }
  };

  return (
    <div
      onClick={() => navigate(`/services?categoryId=${category.id}`)}
      className="group cursor-pointer rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
        {getIcon(category.name)}
      </div>

      <h2 className="mt-6 text-2xl font-bold text-slate-800">
        {category.name}
      </h2>

      <p className="mt-3 text-slate-500">
        Trusted professionals for your home.
      </p>

      <div className="mt-6 flex items-center font-semibold text-blue-600">
        Explore
        <span className="ml-2 transition-transform duration-300 group-hover:translate-x-2">
          →
        </span>
      </div>
    </div>
  );
}

export default CategoryCard;