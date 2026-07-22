import { jwtDecode } from "jwt-decode";

export const saveToken = (token) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const getUser = () => {
  const token = getToken();

  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

export const getRole = () => {
  const user = getUser();

  if (!user) return null;

  return (
    user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ??
    null
  );
};