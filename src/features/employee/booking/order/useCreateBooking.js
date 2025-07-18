import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { createBooking } from "../../../../services/apiEmployeeBooking";
import { notify } from "../../../../redux/notificationSlice";
import { ERROR_NOTIFICATION } from "../../../../utils/constant";
import {
  setActivity,
  setPaymentId,
} from "../../../../redux/employeeBookingSlice";

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      // get payment url from the response
      const paymentId = data?.data?.paymentId;
      // redirect to the payment page
      dispatch(setPaymentId(paymentId));
      dispatch(setActivity("ticket"));
    },
    onError: (error) => {
      console.error("Error creating booking:", error);
      queryClient.invalidateQueries({ queryKey: ["showtimeDetail"] });
      dispatch(
        notify({
          type: ERROR_NOTIFICATION,
          message: error.response.data.message || "Failed to create booking",
        })
      );
    },
  });
}
