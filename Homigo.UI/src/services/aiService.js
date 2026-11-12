import api from "../api/axios";

export const askAi = async (message) => {
  const response = await api.post("/Ai/chat", {
    message,
  });

  return response.data;
};