import api from "../api/axios";

export const addFavorite = async (serviceId) => {
  const response = await api.post(`/Favorite/${serviceId}`);
  return response.data;
};

export const removeFavorite = async (serviceId) => {
  const response = await api.delete(`/Favorite/${serviceId}`);
  return response.data;
};

export const getMyFavorites = async () => {
  const response = await api.get("/Favorite");
  return response.data;
};