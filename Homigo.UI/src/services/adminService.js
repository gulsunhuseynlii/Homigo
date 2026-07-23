import api from "../api/axios";

// -------------------- SERVICES --------------------

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

// -------------------- CATEGORIES --------------------

export const getCategories = async () => {
  const response = await api.get("/Category");
  return response.data.items ?? response.data;
};

export const createCategory = async (data) => {
  const response = await api.post("/Category", data);
  return response.data;
};

export const updateCategory = async (id, data) => {
  const response = await api.put(`/Category/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/Category/${id}`);
  return response.data;
};

// -------------------- DASHBOARD --------------------

export const getDashboardStats = async () => {
  const response = await api.get("/Dashboard/admin");
  return response.data;
};