import { useSelector } from "react-redux";
import { getShowtimes } from "../../../../services/apiEmployeeBooking";
import { useQuery } from "@tanstack/react-query";

export default function useGetShowTimes() {
  const filters = useSelector((state) => state.employeeBooking.filters);

  return useQuery({
    queryKey: ["showtimes", filters],
    queryFn: () => getShowtimes(filters),
    enabled: !!filters.theaterId && !!filters.date,
    staleTime: 2 * 60 * 1000, // 2 minutes
    select: (data) => {
      return data?.data || [];
    },
  });
}
