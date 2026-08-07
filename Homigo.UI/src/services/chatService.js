import api from "../api/axios";

export const getMessages = async (orderId) => {
  const { data } = await api.get(`/chat/${orderId}`);
  return data;
};

export const sendMessage = async (payload) => {
  const { data } = await api.post("/chat", payload);
  return data;
};