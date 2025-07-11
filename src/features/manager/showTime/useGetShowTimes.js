import { useQuery } from "@tanstack/react-query";
import { getShowTimes } from "../../../services/apiShowTime";
import { useSelector } from "react-redux";

export default function useGetShowTimes() {
  const filters = useSelector((state) => state.manageShowtime.filters);

  return useQuery({
    queryKey: ["showtimes", filters],
    queryFn: () => getShowTimes(filters),
    enabled: !!filters.startDate && !!filters.endDate && !!filters.screenId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    select: (data) => {
      return data?.data || [];
    },
  });
}
