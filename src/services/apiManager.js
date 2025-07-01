import axios from "../utils/axios-customize";

export const getAllManagers = async () => {
  const response = await axios.get("/api/managers");
  return response.data;
};

export const createManager = async ({
  username,
  email,
  password,
  phoneNumber,
  theaterId,
}) => {
  const response = await axios.post("/api/managers", {
    username,
    email,
    password,
    phoneNumber,
    theaterId,
  });
  return response.data;
};

export const updateManager = async (
  id,
  { username, email, phoneNumber, theaterId }
) => {
  const response = await axios.put(`/api/managers/${id}`, {
    username,
    email,
    phoneNumber,
    theaterId,
  });
  return response.data;
};

export const lockManager = async (id) => {
  const response = await axios.put(`/api/managers/${id}/lock`);
  return response.data;
};

export const unlockManager = async (id) => {
  const response = await axios.put(`/api/managers/${id}/unlock`);
  return response.data;
};
