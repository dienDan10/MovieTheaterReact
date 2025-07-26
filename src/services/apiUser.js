import axios from "../utils/axios-customize";

export const getUserProfile = async () => {
  const res = axios.get("/api/user/profile");
  return res;
};

export const getUserProfileByEmail = async (email) => {
  const res = axios.get(`/api/user/profile/${email}`);
  return res;
};
