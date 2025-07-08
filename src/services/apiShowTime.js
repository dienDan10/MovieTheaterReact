import customAxios from "../utils/axios-customize";

export const getShowTimes = async () => {
  const res = await customAxios.get("/api/showtimes");
  return res.data;
};

export const getShowTimeById = async (id) => {
  const res = await customAxios.get(`/api/showtimes/${id}`);
  return res.data;
};

export const createShowTime = async ({
  movieId,
  screenId,
  date,
  startTime,
  endTime,
  ticketPrice,
}) => {
  const res = await customAxios.post("/api/showtimes", {
    movieId,
    screenId,
    date,
    startTime,
    endTime,
    ticketPrice,
  });
  return res.data;
};

export const updateShowTime = async ({
  id,
  movieId,
  screenId,
  date,
  startTime,
  endTime,
  ticketPrice,
}) => {
  const res = await customAxios.put(`/api/showtimes/${id}`, {
    movieId,
    screenId,
    date,
    startTime,
    endTime,
    ticketPrice,
  });
  return res.data;
};

export const deleteShowTime = async (id) => {
  const res = await customAxios.delete(`/api/showtimes/${id}`);
  return res.data;
};
