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
export const createService = async (data) => {
  const response = await api.post("/Service", data);

  return response.data;
};

export const updateService = async (id, data) => {
  const response = await api.put(`/Service/${id}`, data);

  return response.data;
};

export const deleteService = async (id) => {
  const response = await api.delete(`/Service/${id}`);

  return response.data;
};
export const getMyServices = async () => {
  const response = await api.get("/Service/my");
  return response.data;
};