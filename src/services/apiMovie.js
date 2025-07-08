import axios from "../utils/axios-customize";

export const getMovies = async ({ title, pageNumber, pageSize }) => {
  const params = new URLSearchParams();
  if (title) params.append("title", title);
  if (pageNumber !== undefined) params.append("pageNumber", pageNumber);
  if (pageSize !== undefined) params.append("pageSize", pageSize);
  const res = await axios.get(`/api/movies?${params.toString()}`);
  return res.data;
};

export const getMovieById = async (id) => {
  const res = await axios.get(`/api/movies/${id}`);
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
  imageFile,
  trailerUrl,
}) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("genre", genre);
  formData.append("director", director);
  formData.append("cast", cast);
  formData.append("description", description);
  formData.append("duration", duration);
  formData.append("releaseDate", releaseDate);
  if (imageFile) {
    formData.append("File", imageFile, imageFile.name);
  }
  formData.append("trailerUrl", trailerUrl);

  const res = await axios.post("/api/movies", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
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
  imageFile,
  trailerUrl,
}) => {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("genre", genre);
  formData.append("director", director);
  formData.append("cast", cast);
  formData.append("description", description);
  formData.append("duration", duration);
  formData.append("releaseDate", releaseDate);
  if (imageFile) {
    formData.append("File", imageFile, imageFile.name);
  }
  formData.append("trailerUrl", trailerUrl);
  const res = await axios.put(`/api/movies/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const disableMovie = async (id) => {
  const res = await axios.put(`/api/movies/${id}/disable`);
  return res.data;
};

export const enableMovie = async (id) => {
  const res = await axios.put(`/api/movies/${id}/enable`);
  return res.data;
};
