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