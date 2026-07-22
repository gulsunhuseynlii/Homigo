import api from "../api/axios";

export const createOrder = async (data) => {
  const response = await api.post("/Order", data);
  return response.data;
};

export const getMyOrders = async () => {
  const response = await api.get("/Order/my-orders");
  return response.data;
};