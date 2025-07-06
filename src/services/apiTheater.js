import axios from "../utils/axios-customize";

export const getAllTheaters = async () => {
  const response = await axios.get("/api/theaters");
  return response.data;
};

export const getTheaterById = async (id) => {
  const response = await axios.get(`/api/theaters/${id}`);
  return response.data;
};

export const createTheater = async ({
  name,
  address,
  phone,
  email,
  description,
  provinceId,
}) => {
  const response = await axios.post("/api/theaters", {
    name,
    address,
    phone,
    email,
    description,
    provinceId,
  });
  return response.data;
};

export const updateTheater = async ({
  id,
  name,
  address,
  phone,
  email,
  description,
  provinceId,
}) => {
  const response = await axios.put(`/api/theaters/${id}`, {
    name,
    address,
    phone,
    email,
    description,
    provinceId,
  });
  return response.data;
};

export const lockUnlockTheater = async (id) => {
  const response = await axios.put(`/api/theaters/${id}/lock`);
  return response.data;
};
