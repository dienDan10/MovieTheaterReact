import { useMutation } from "@tanstack/react-query";
import { checkinTicket } from "../../../services/apiEmployeeBooking";

export function useCheckinTicket() {
  // Using mutation without default callbacks since we'll provide them when calling mutate
  const mutation = useMutation({
    mutationFn: ({ paymentId, employeeId }) =>
      checkinTicket({ paymentId, employeeId }),
  });

  return mutation;
}
