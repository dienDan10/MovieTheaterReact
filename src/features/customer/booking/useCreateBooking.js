import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { createBooking } from "../../../services/apiBooking";
import { notify } from "../../../redux/notificationSlice";
import { ERROR_NOTIFICATION } from "../../../utils/constant";

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: createBooking,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      // get payment url from the response
      const paymentUrl = data?.data?.paymentUrl;
      // redirect to the payment page
      if (paymentUrl) {
        window.location.href = paymentUrl;
      }
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
