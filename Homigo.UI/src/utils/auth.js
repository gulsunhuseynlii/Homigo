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
  const token = getToken();

  if (!token) return false;

  try {
    const decoded = jwtDecode(token);

    if (decoded.exp * 1000 < Date.now()) {
      logout();
      return false;
    }

    return true;
  } catch {
    logout();
    return false;
  }
};

export const getUser = () => {
  const token = getToken();

  if (!token) return null;

  try {
    const decoded = jwtDecode(token);

    if (decoded.exp * 1000 < Date.now()) {
      logout();
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
};

export const getRole = () => {
  const user = getUser();

  if (!user) return null;

  return (
    user[
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
    ] ?? null
  );
};