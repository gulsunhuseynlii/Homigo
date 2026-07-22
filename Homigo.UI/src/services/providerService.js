import api from "../api/axios";

export const getProviders = async (serviceId) => {
  const response = await api.get("/Provider/filter", {
    params: {
      serviceId,
    },
  });

  return response.data;
};

export const getProviderById = async (id) => {
  const response = await api.get(`/Provider/${id}`);

  return response.data;
};