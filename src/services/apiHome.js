import axios from "../utils/axios-customize";

export const getCurrentAiringMovies = async () => {
  const response = await axios.get("/api/home/movies/airing");
  return response.data;
};

export const getUpcomingMovies = async () => {
  const response = await axios.get("/api/home/movies/upcoming");
  return response.data;
};
