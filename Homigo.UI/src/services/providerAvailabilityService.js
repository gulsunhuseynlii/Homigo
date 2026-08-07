import api from "../api/axios";

export const getMyAvailability = async () => {
  const response = await api.get("/Provider/my-availability");
  return response.data;
};

export const updateAvailability = async (data) => {
  const response = await api.put(
    "/Provider/availability",
    data
  );

  return response.data;
};