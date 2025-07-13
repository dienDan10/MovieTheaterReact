import axios from "../utils/axios-customize";

export const getShowtimeDetails = async (showtimeId) => {
  const response = await axios.get(`/api/bookings/showtimes/${showtimeId}`);
  return response.data;
};

export const createBooking = async (bookingData) => {
  const response = await axios.post("/api/bookings", bookingData);
  return response.data;
};

export const verifyPayment = async ({ paymentId, vnpayParams }) => {
  const response = await axios.post("/api/bookings/vnpay/verify", {
    paymentId,
    vnpayParams,
  });
  return response.data;
};
