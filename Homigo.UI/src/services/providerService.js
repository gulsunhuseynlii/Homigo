import api from "../api/axios";

export const getProviders = async (serviceId) => {
  const url = serviceId
    ? `/Provider/filter?serviceId=${serviceId}`
    : "/Provider";

  const response = await api.get(url);
  return response.data;
};

export const getProviderById = async (id) => {
  const response = await api.get(`/Provider/${id}`);
  return response.data;
};

export const applyProvider = async (formData) => {
  const response = await api.post(
    "/Provider/apply",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const getPendingProviders = async () => {
  const response = await api.get("/Provider/pending");
  return response.data;
};

export const approveProvider = async (userId) => {
  const response = await api.put(
    `/Provider/approve/${userId}`
  );

  return response.data;
};