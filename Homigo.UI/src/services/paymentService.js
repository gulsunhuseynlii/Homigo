import api from "../api/axios";

export const createCheckoutSession = async (
  orderId
) => {
  const response = await api.post(
    `/Payment/checkout/${orderId}`
  );

  return response.data;
};

export const getMyPayments = async () => {
  const response = await api.get(
    "/Payment/my-payments"
  );

  return response.data;
};