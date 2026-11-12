import api from "../api/axios";

export const getProfile = async () => {
  const response = await api.get("/Auth/profile");
  return response.data;
};

export const updateProfile = async (formData) => {
  const response = await api.put("/Auth/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const changePassword = async (data) => {
  const response = await api.put(
    "/Auth/change-password",
    data
  );

  return response.data;
};

export const deleteMyAccount = async () => {
  const response = await api.delete("/Auth/me");

  return response.data;
};