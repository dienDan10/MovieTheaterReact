import axios from "../utils/axios-customize";

export const getCurrentAiringMovies = async () => {
  const response = await axios.get("/api/home/movies/airing");
  return response.data;
};

export const getUpcomingMovies = async () => {
  const response = await axios.get("/api/home/movies/upcoming");
  return response.data;
};

export const getShowtimes = async ({ movieId, provinceId, date }) => {
  const params = new URLSearchParams();
  if (provinceId) params.append("provinceId", provinceId);
  if (date) params.append("date", date);
  const response = await axios.get(
    `/api/home/movies/${movieId}/showtimes?${params.toString()}`
  );
  return response.data;
};
