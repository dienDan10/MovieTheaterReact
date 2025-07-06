import axios from "../utils/axios-customize";

export const getScreens = async (theaterId) => {
  const response = await axios.get(`api/screens?theaterId=${theaterId || 0}`);
  return response.data;
};

export const createScreen = async ({ name, theaterId, rows, columns }) => {
  const response = await axios.post("api/screens", {
    name,
    theaterId,
    rows,
    columns,
  });
  return response.data;
};

export const updateScreen = async ({ id, name }) => {
  const response = await axios.put(`api/screens/${id}`, {
    name,
  });
  return response.data;
};

export const enableScreen = async (id) => {
  const response = await axios.put(`api/screens/${id}/enable`);
  return response.data;
};

export const disableScreen = async (id) => {
  const response = await axios.put(`api/screens/${id}/disable`);
  return response.data;
};
