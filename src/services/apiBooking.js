import axios from "../utils/axios-customize";

export const getShowtimeDetails = async (showtimeId) => {
  const response = await axios.get(`/api/bookings/showtimes/${showtimeId}`);
  return response.data;
};
