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
