import { useMutation } from "@tanstack/react-query";
import { verifyPayment } from "../../../../services/apiBooking";

export function useVerifyPayment() {
  return useMutation({
    mutationFn: async ({ paymentId, vnpayParams }) =>
      verifyPayment({ paymentId, vnpayParams }),
    onSuccess: (data) => {
      // Handle successful payment verification
      console.log("Payment verified successfully:", data);
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
