import api from "../api/axios";

export const getAddresses = async () => {
  const response = await api.get("/Address");
  return response.data;
};

export const createAddress = async (data) => {
  const response = await api.post("/Address", data);
  return response.data;
};

export const updateAddress = async (id, data) => {
  const response = await api.put(`/Address/${id}`, data);
  return response.data;
};

export const deleteAddress = async (id) => {
  const response = await api.delete(`/Address/${id}`);
  return response.data;
};
export const createCategory = async (data) => {
  const response = await api.post("/Category", data);
  return response.data;
};

export const updateCategory = async (id, data) => {
  await api.put(`/Category/${id}`, data);
};

export const deleteCategory = async (id) => {
  await api.delete(`/Category/${id}`);
};