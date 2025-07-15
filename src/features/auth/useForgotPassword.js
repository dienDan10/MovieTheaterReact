import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../../services/apiAuth";
import { useDispatch } from "react-redux";
import { notify } from "../../redux/notificationSlice";

export function useForgotPassword() {
  const dispatch = useDispatch();

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      dispatch(
        notify({
          type: "success",
          message: "Password Reset Email Sent",
          description:
            "We've sent a password reset link to your email. Please check your inbox.",
        })
      );
    },
    onError: (error) => {
      dispatch(
        notify({
          type: "error",
          message: "Failed to send reset email",
          description:
            error.response?.data?.message ||
            "Something went wrong. Please try again later.",
        })
      );
    },
  });

  return forgotPasswordMutation;
}
