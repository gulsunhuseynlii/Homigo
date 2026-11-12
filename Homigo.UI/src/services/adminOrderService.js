import api from "../api/axios";

export const getAllOrders = async (params) => {
  const response = await api.get("/Order/all", {
    params,
  });

  return response.data;
};