import api from "../api/axios";

export const getMyJobs = async () => {
  const response = await api.get("/Order/my-provider-orders");

  return response.data;
};

export const acceptOrder = async (id) => {
  const response = await api.put(`/Order/accept/${id}`);

  return response.data;
};

export const startOrder = async (id) => {
  const response = await api.put(`/Order/start/${id}`);

  return response.data;
};

export const completeOrder = async (id) => {
  const response = await api.put(`/Order/complete/${id}`);

  return response.data;
};