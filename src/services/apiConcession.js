import axios from "../utils/axios-customize";

export const getAllConcessions = async () => {
  const response = await axios.get("/api/concessions");
  return response.data;
};

export const getConcessionById = async (id) => {
  const response = await axios.get(`/api/concessions/${id}`);
  return response.data;
};

export const createConcession = async ({
  name,
  description,
  price,
  imageFile,
}) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);
  formData.append("price", price);
  if (imageFile) {
    formData.append("File", imageFile, imageFile.name);
  }
  const response = await axios.post("/api/concessions", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateConcession = async ({
  id,
  name,
  description,
  price,
  imageFile,
}) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("description", description);
  formData.append("price", price);
  if (imageFile) {
    formData.append("File", imageFile, imageFile.name);
  }
  const response = await axios.put(`/api/concessions/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const disableConcession = async (id) => {
  const response = await axios.put(`/api/concessions/${id}/disable`);
  return response.data;
};

export const enableConcession = async (id) => {
  const response = await axios.put(`/api/concessions/${id}/enable`);
  return response.data;
};

export const deleteConcession = async (id) => {
  const response = await axios.delete(`/api/concessions/${id}`);
  return response.data;
};
