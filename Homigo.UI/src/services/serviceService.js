import api from "../api/axios";

export const getServices = async (params = {}) => {
  const response = await api.get("/Service", {
    params,
  });

  return response.data;
};

export const getServiceById = async (id) => {
  const response = await api.get(`/Service/${id}`);

  return response.data;
};