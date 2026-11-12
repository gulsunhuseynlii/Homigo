import api from "../api/axios";

export const login = (data) => {
  return api.post("/Auth/login", data);
};

export const register = (data) => {
  return api.post("/Auth/register", data);
};
export const forgotPassword = async (email) => {
  const { data } = await api.post(
    "/auth/forgot-password",
    { email }
  );

  return data;
};

export const resetPassword = async (token, newPassword) => {
  const { data } = await api.post(
    "/auth/reset-password",
    {
      token,
      newPassword,
    }
  );

  return data;
};