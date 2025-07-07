import { useQuery } from "@tanstack/react-query";
import { getSeatByScreenId } from "../../../services/apiSeat";

export const useGetSeats = (screenId) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["seats", screenId],
    queryFn: () => getSeatByScreenId(screenId),
    enabled: !!screenId, // Only run the query if we have a screenId
  });

  // Return the raw data from the API for the component to process
  return {
    seats: data?.data || [],
    isLoading,
    error,
    refetch,
  };
};
