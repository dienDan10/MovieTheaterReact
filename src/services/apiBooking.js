import axios from "../utils/axios-customize";

export const getShowtimeDetails = async (showtimeId) => {
  const response = await axios.get(`/api/bookings/showtimes/${showtimeId}`);
  return response.data;
};

export const createBooking = async (bookingData) => {
  const response = await axios.post("/api/bookings", bookingData);
  return response.data;
};

export const verifyPayment = async ({ paymentId, vnpParams }) => {
  const response = await axios.post("/api/bookings/vnpay/verify", {
    paymentId,
    vnpParams,
  });
  return response.data;
};

export const getBookingDetails = async (paymentId) => {
  const response = await axios.get(`/api/bookings/payment/${paymentId}`);
  return response.data;
};

export const getBookingHistory = async () => {
  const response = await axios.get("/api/bookings/history");
  return response.data;
}

export function cancelBooking(paymentId) {
  return axios.delete(`/api/bookings/payment/${paymentId}`);
}
