import axios from "../utils/axios-customize";

export const getShowtimes = async ({ theaterId, date }) => {
  const params = new URLSearchParams();
  if (theaterId) params.append("theaterId", theaterId);
  if (date) params.append("date", date);
  const response = await axios.get(
    `/api/employee/booking/showtimes?${params.toString()}`
  );
  return response.data;
};
