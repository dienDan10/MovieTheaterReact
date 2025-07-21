import axios from "../utils/axios-customize";

export const register = async ({ username, email, password }) => {
  const res = await axios.post("/api/auth/register", {
    username,
    email,
    password,
  });

  return res;
};

export const login = async ({ email, password }) => {
  const res = await axios.post("/api/auth/login", {
    email,
    password,
  });

  return res;
};

export const confirmEmail = async ({ userId, token }) => {
  const res = await axios.post("/api/auth/confirm-email", {
    userId,
    token,
  });

  return res;
};

export const forgotPassword = async ({ email }) => {
  const res = await axios.post("/api/auth/forgot-password", {
    email,
  });

  return res;
};

export const resetPassword = async ({ userId, resetToken, password }) => {
  const res = await axios.post("/api/auth/reset-password", {
    userId,
    resetToken,
    password,
  });

  return res;
};

export const changePassword = async ({ oldPassword, newPassword }) => {
  const res = await axios.post("/api/auth/change-password", {
    oldPassword,
    newPassword,
  });

  return res;
};
