import axios from "../utils/axios-customize";

export const getAllCustomers = async ({
  name,
  email,
  sortBy,
  isDescending,
  pageNumber,
  pageSize,
}) => {
  const params = new URLSearchParams();
  if (name) params.append("name", name);
  if (email) params.append("email", email);
  if (sortBy) params.append("sortBy", sortBy);
  if (isDescending !== undefined) params.append("isDescending", isDescending);
  if (pageNumber !== undefined) params.append("pageNumber", pageNumber);
  if (pageSize !== undefined) params.append("pageSize", pageSize);
  const response = await axios.get(`/api/customers?${params.toString()}`);
  return response.data;
};

export const lockCustomer = async (id) => {
  const response = await axios.put(`/api/customers/${id}/lock`);
  return response.data;
};

export const unlockCustomer = async (id) => {
  const response = await axios.put(`/api/customers/${id}/unlock`);
  return response.data;
};
