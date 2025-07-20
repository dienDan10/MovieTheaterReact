import axios from "../utils/axios-customize";

export const getRevenue = async ({ startDate, endDate, theaterId }) => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (theaterId) params.append("theaterId", theaterId);

  const response = await axios.get(`/api/revenue?${params.toString()}`);
  return response.data;
};
