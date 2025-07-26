import { useQuery } from "@tanstack/react-query";
import { getPromotionById } from "../../../services/apiPromotion";

export const useGetPromotionById = (id, enabled = true) => {
  return useQuery({
    queryKey: ["promotion", id],
    queryFn: () => getPromotionById(id),
    enabled: !!id && enabled,
  });
};
