import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "../../services/apiAuth";
import { useDispatch } from "react-redux";
import { notify } from "../../redux/notificationSlice";
import { useNavigate } from "react-router-dom";

export function useResetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const resetPasswordMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      dispatch(
        notify({
          type: "success",
          message: "Password Reset Successful",
          description:
            "Your password has been reset successfully. You can now log in with your new password.",
        })
      );
      // Redirect to login page after successful password reset
      navigate("/login");
    },
    onError: (error) => {
      dispatch(
        notify({
          type: "error",
          message: "Password Reset Failed",
          description:
            error.response?.data?.message ||
            "Something went wrong. Please try again or request a new reset link.",
        })
      );
    },
  });

  return resetPasswordMutation;
}
