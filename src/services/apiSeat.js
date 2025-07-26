import axios from "../utils/axios-customize";

export const getSeatByScreenId = async (screenId) => {
  const response = await axios.get(`/api/seats?screenId=${screenId || 0}`);
  return response.data;
};

export const addOneRow = async (screenId) => {
  const response = await axios.put(`/api/seats/add-row?screenId=${screenId}`);
  return response.data;
};

export const addOneColumn = async (screenId) => {
  const response = await axios.put(
    `/api/seats/add-column?screenId=${screenId}`
  );
  return response.data;
};

export const removeOneRow = async (screenId) => {
  const response = await axios.put(
    `/api/seats/remove-row?screenId=${screenId}`
  );
  return response.data;
};

export const removeOneColumn = async (screenId) => {
  const response = await axios.put(
    `/api/seats/remove-column?screenId=${screenId}`
  );
  return response.data;
};

export const disableSeat = async (seatId) => {
  const response = await axios.put(`/api/seats/${seatId}/disable`);
  return response.data;
};

export const enableSeat = async (seatId) => {
  const response = await axios.put(`/api/seats/${seatId}/enable`);
  return response.data;
};

export const setVip = async (seatId) => {
  const response = await axios.put(`/api/seats/${seatId}/set-vip`);
  return response.data;
};

export const setNormal = async (seatId) => {
  const response = await axios.put(`/api/seats/${seatId}/set-normal`);
  return response.data;
};
