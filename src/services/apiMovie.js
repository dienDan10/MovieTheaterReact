import customAxios from "../utils/axios-customize";

export const getMovies = async () => {
  const res = await customAxios.get("/api/movies");
  return res.data;
};

export const getMovieById = async (id) => {
  const res = await customAxios.get(`/api/movies/${id}`);
  return res.data;
};

export const createMovie = async ({
  title,
  genre,
  director,
  cast,
  description,
  duration,
  releaseDate,
  posterUrl,
  trailerUrl,
}) => {
  const res = await customAxios.post("/api/movies", {
    title,
    genre,
    director,
    cast,
    description,
    duration,
    releaseDate,
    posterUrl,
    trailerUrl,
  });
  return res.data;
};

export const updateMovie = async ({
  id,
  title,
  genre,
  director,
  cast,
  description,
  duration,
  releaseDate,
  posterUrl,
  trailerUrl,
}) => {
  const res = await customAxios.put(`/api/movies/${id}`, {
    title,
    genre,
    director,
    cast,
    description,
    duration,
    releaseDate,
    posterUrl,
    trailerUrl,
  });
  return res.data;
};

export const deleteMovie = async (id) => {
  const res = await customAxios.delete(`/api/movies/${id}`);
  return res.data;
};
