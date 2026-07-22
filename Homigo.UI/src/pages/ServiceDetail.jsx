import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getServiceById } from "../services/serviceService";

function ServiceDetail() {
  const { id } = useParams();

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
    return <h2 style={{ padding: "40px" }}>Loading...</h2>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>{service.name}</h1>

      <p>{service.description}</p>

      <p>
        <strong>Category:</strong> {service.categoryName}
      </p>

      <p>
        <strong>Price:</strong> {service.basePrice} ₼
      </p>

      <p>
        <strong>Estimated Time:</strong> {service.estimatedMinutes} minutes
      </p>

      <button
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Book Now
      </button>
    </div>
  );
}

export default ServiceDetail;