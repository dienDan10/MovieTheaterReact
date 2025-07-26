import { useQuery } from "@tanstack/react-query";
import { getPromotions } from "../../../services/apiPromotion";

export const useGetPromotions = () => {
  return useQuery({
    queryKey: ["promotions"],
    queryFn: getPromotions,
  });
};
