import axios from "../utils/axios-customize";

export const getAllEmployees = async ({
  name,
  email,
  theaterId,
  sortBy,
  isDescending,
  pageNumber,
  pageSize,
}) => {
  const params = new URLSearchParams();
  if (name) params.append("name", name);
  if (email) params.append("email", email);
  if (theaterId) params.append("theaterId", theaterId);
  if (sortBy) params.append("sortBy", sortBy);
  if (isDescending !== undefined) params.append("isDescending", isDescending);
  if (pageNumber !== undefined) params.append("pageNumber", pageNumber);
  if (pageSize !== undefined) params.append("pageSize", pageSize);

  const response = await axios.get(`/api/employees?${params.toString()}`);
  return response.data;
};

export const createEmployee = async ({
  username,
  email,
  password,
  phoneNumber,
  theaterId,
}) => {
  const response = await axios.post("/api/employees", {
    username,
    email,
    password,
    phoneNumber,
    theaterId,
  });
  return response.data;
};

export const updateEmployee = async ({
  id,
  username,
  email,
  phoneNumber,
  theaterId,
}) => {
  const response = await axios.put(`/api/employees/${id}`, {
    username,
    email,
    phoneNumber,
    theaterId,
  });
  return response.data;
};

export const lockEmployee = async (id) => {
  const response = await axios.put(`/api/employees/${id}/lock`);
  return response.data;
};

export const unlockEmployee = async (id) => {
  const response = await axios.put(`/api/employees/${id}/unlock`);
  return response.data;
};
