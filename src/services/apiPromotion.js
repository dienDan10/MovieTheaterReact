import axios from "../utils/axios-customize";

export const getPromotions = async () => {
  const response = await axios.get("/api/promotions");
  return response.data;
};

export const getActivePromotions = async () => {
  const response = await axios.get("/api/promotions/active");
  return response.data;
};

export const getPromotionById = async (id) => {
  const response = await axios.get(`/api/promotions/${id}`);
  return response.data;
};

export const createPromotion = async ({
  description,
  discountType,
  discountValue,
  quantity,
  startDate,
  endDate,
}) => {
  const response = await axios.post("/api/promotions", {
    description,
    discountType,
    discountValue,
    quantity,
    startDate,
    endDate,
  });
  return response.data;
};

export const updatePromotion = async ({
  id,
  description,
  discountType,
  discountValue,
  quantity,
  startDate,
  endDate,
}) => {
  const response = await axios.put(`/api/promotions/${id}`, {
    description,
    discountType,
    discountValue,
    quantity,
    startDate,
    endDate,
  });
  return response.data;
};

export const deletePromotion = async (id) => {
  const response = await axios.delete(`/api/promotions/${id}`);
  return response.data;
};

export const enablePromotion = async (id) => {
  const response = await axios.put(`/api/promotions/${id}/enable`);
  return response.data;
};

export const disablePromotion = async (id) => {
  const response = await axios.put(`/api/promotions/${id}/disable`);
  return response.data;
};
