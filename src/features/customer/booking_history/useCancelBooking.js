import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelBooking } from "../../../services/apiBooking";

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries(["bookingHistory"]);
    },
  });
}
