import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getServices } from "../services/serviceService";

function Services() {
  const [services, setServices] = useState([]);
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  const categoryId = searchParams.get("categoryId");

  useEffect(() => {
    loadServices();
  }, [categoryId]);

  const loadServices = async () => {
    try {
      const data = await getServices({
        categoryId,
      });

      setServices(data.items ?? data);
    } catch {
      toast.error("Failed to load services.");
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Services</h1>

      {services.length === 0 ? (
        <p>No services found.</p>
      ) : (
        services.map((service) => (
          <div
            key={service.id}
            onClick={() => navigate(`/services/${service.id}`)}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "20px",
              marginBottom: "15px",
              cursor: "pointer",
            }}
          >
            <h3>{service.name}</h3>

            <p>{service.description}</p>

            <p>
              <strong>Price:</strong> {service.basePrice} ₼
            </p>

            <p>
              <strong>Duration:</strong> {service.estimatedMinutes} min
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default Services;