import { useQuery } from "@tanstack/react-query";
import { getShowtimeDetails } from "../../../services/apiBooking";
import { useSelector } from "react-redux";

export function useGetShowtimeDetail() {
  const { selectedShowtime } = useSelector((state) => state.employeeBooking);

  // get showtime details from API
  const { data, isLoading, error } = useQuery({
    queryKey: ["showtimeDetail", selectedShowtime?.id],
    queryFn: () => getShowtimeDetails(selectedShowtime?.id),
    enabled: !!selectedShowtime?.id, // Only fetch if selectedShowtime is available
  });

  return {
    showtimeDetail: data?.data,
    isLoading,
    error,
  };
}
