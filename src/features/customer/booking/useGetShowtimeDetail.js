import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getShowtimeDetails } from "../../../services/apiBooking";

export function useGetShowtimeDetail() {
  // get showtime id from URL params
  const { showtimeId } = useParams();

  // get showtime details from API
  const { data, isLoading, error } = useQuery({
    queryKey: ["showtimeDetail", showtimeId],
    queryFn: () => getShowtimeDetails(showtimeId),
    enabled: !!showtimeId,
  });

  return {
    showtimeDetail: data?.data,
    isLoading,
    error,
  };
}
