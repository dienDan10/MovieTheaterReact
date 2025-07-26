import { useQuery } from "@tanstack/react-query";
import { getActivePromotions } from "../../../services/apiPromotion";

export const useGetActivePromotions = () => {
  const { isLoading, data, isError } = useQuery({
    queryKey: ["activePromotions"],
    queryFn: getActivePromotions,
  });

  return {
    isLoading,
    promotions: data?.data || [],
    isError,
  };
};
