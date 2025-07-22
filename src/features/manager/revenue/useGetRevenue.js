import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { getRevenue } from "../../../services/apiRevenue";
import { ROLE_ADMIN, ROLE_MANAGER } from "../../../utils/constant";

export function useGetRevenue() {
  const { filters } = useSelector((state) => state.revenue);
  const { user } = useSelector((state) => state.user);
  const { startDate, endDate, theaterId } = filters;

  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: ["revenue", filters],
    queryFn: () => getRevenue(filters),
    enabled:
      !!startDate && !!endDate && (user.role === ROLE_ADMIN || !!theaterId), // Only fetch if dates are set and user is admin or theaterId is set
    refetchOnWindowFocus: false,
  });

  return {
    revenue: data?.data || [],
    isFetching,
    isError,
    refetch,
  };
}
