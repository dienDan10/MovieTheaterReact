import { useQuery } from "@tanstack/react-query";
import { getBookingDetails } from "../../../../services/apiBooking";

export function useGetBookingDetail(paymentId) {
  return useQuery({
    queryKey: ["bookingDetail", paymentId],
    queryFn: () => getBookingDetails(paymentId),
    enabled: !!paymentId, // Only run the query if paymentId exists
    staleTime: 0, // No caching for this data, always refetch
    refetchOnWindowFocus: false,
    retry: false,
  });
}
