import axios from "../utils/axios-customize";

export const getAllProvinces = async () => {
  const res = await axios.get("/api/provinces");
  return res;
};

export const getProvinceById = async (id) => {
  const res = await axios.get(`/api/provinces/${id}`);
  return res;
};

export const createProvince = async ({ id, name }) => {
  const res = await axios.post("/api/provinces", {
    id,
    name,
  });
  return res;
};

export const updateProvince = async ({ id, name }) => {
  const res = await axios.put(`/api/provinces/${id}`, {
    name,
  });
  return res;
};

export const deleteProvince = async (id) => {
  const res = await axios.delete(`/api/provinces/${id}`);
  return res;
};
