import { useQuery } from "@tanstack/react-query";
import { getBookingDetails } from "../../../services/apiBooking";

export function useBookingDetail(paymentId, enabled = true) {
  return useQuery({
    queryKey: ["bookingDetail", paymentId],
    queryFn: () => getBookingDetails(paymentId),
    select: (res) => res.data,
    enabled: !!paymentId && enabled,
  });
}
