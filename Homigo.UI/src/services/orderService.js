import api from "../api/axios";

export const createOrder = async (data) => {
  const response = await api.post("/Order", data);
  return response.data;
};

export const getMyOrders = async (params) => {
  const response = await api.get("/Order/my-orders", {
    params,
  });

  return response.data;
};
export const getMyProviderOrders = async () => {
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
export const cancelOrder = async (id) => {
  const response = await api.put(`/Order/cancel/${id}`);
  return response.data;
};
export const rejectOrder = async (id) => {
  const response = await api.put(`/Order/reject/${id}`);
  return response.data;
};