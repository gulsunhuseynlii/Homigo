import api from "../api/axios";

export const createReview = async (data) => {
  const response = await api.post("/Review", data);

  return response.data;
};

export const getProviderReviews = async (providerId) => {
  const response = await api.get(
    `/Review/provider/${providerId}`
  );

  return response.data;
};
export const getServiceReviews = async (serviceId) => {
  const response = await api.get(`/Review/service/${serviceId}`);
  return response.data;
};