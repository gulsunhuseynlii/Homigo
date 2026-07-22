import api from "../api/axios";

export const getServices = async () => {
  const response = await api.get("/Service");
  return response.data.items ?? response.data;
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

export const getCategories = async () => {
  const response = await api.get("/Category");
  return response.data.items ?? response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get("/Dashboard/admin");
  return response.data;
};