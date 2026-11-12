import api from "../api/axios";

export const getProfile = async () => {
  const { data } = await api.get("/auth/profile");

  return data;
};

export const updateProfile = async (formData) => {
  const { data } = await api.put(
    "/auth/profile",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

export const changePassword = async (data) => {
  const { data: response } = await api.put(
    "/auth/change-password",
    data
  );

  return response;
};