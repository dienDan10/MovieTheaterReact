import { useQuery } from "@tanstack/react-query";
import { getBookingHistory } from "../../../services/apiBooking";
import { useSelector } from "react-redux";

export function useBookingHistory() {
  const filter = useSelector((state) => state.booking.bookingHistoryFilter);

  return useQuery({
    queryKey: ["bookingHistory", filter],
    queryFn: () => getBookingHistory(filter),
    enabled: !!filter.fromDate && !!filter.toDate,
    select: (res) => res.data,
  });
}
