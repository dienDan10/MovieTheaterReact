import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getRevenue } from "../../../services/apiRevenue";

export function useGetRevenue() {
  const { filters } = useSelector((state) => state.revenue);
  const { startDate, endDate, theaterId } = filters;

  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: ["revenue", filters],
    queryFn: () => getRevenue(filters),
    enabled: !!startDate && !!endDate && !!theaterId,
  });

  return {
    revenue: data?.data || [],
    isFetching,
    isError,
    refetch,
  };
}
