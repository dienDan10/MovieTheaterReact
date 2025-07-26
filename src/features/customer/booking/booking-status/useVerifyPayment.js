import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyPayment } from "../../../../services/apiBooking";
import { useDispatch } from "react-redux";
import { notify } from "../../../../redux/notificationSlice";
import { SUCCESS_NOTIFICATION } from "../../../../utils/constant";

export function useVerifyPayment() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const query = new URLSearchParams(window.location.search);
  const paymentId = query.get("paymentId");
  const vnpParams = {};

  query.forEach((value, key) => {
    if (key.startsWith("vnp_")) {
      vnpParams[key] = value;
    }
  });

  return useMutation({
    mutationFn: async () => verifyPayment({ paymentId, vnpParams }),
    onSuccess: (data) => {
      dispatch(
        notify({
          type: SUCCESS_NOTIFICATION,
          message: "Payment verified successfully!",
        })
      );
      queryClient.invalidateQueries(["userProfile"]);
      return data;
    },
    onError: (error) => {
      // Handle error in payment verification
      console.error("Error verifying payment:", error);
      throw new Error(
        error.response?.data?.message || "Failed to verify payment"
      );
    },
  });
}
