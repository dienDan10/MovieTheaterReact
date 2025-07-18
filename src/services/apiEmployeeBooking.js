import axios from "../utils/axios-customize";

export const getShowtimes = async ({ theaterId, date }) => {
  const params = new URLSearchParams();
  if (theaterId) params.append("theaterId", theaterId);
  if (date) params.append("date", date);
  const response = await axios.get(
    `/api/employee/bookings/showtimes?${params.toString()}`
  );
  return response.data;
};

export const createBooking = async (bookingData) => {
  const response = await axios.post("/api/employee/bookings", bookingData);
  return response.data;
};
