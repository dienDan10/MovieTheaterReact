import { useMutation } from "@tanstack/react-query";
import { register } from "../../services/apiAuth";
import { useDispatch } from "react-redux";
import { notify } from "../../redux/notificationSlice";
import { ERROR_NOTIFICATION, SUCCESS_NOTIFICATION } from "../../utils/constant";

export function useRegister() {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: async ({ username, email, password }) =>
      register({ username, email, password }),
    onSuccess: () => {
      dispatch(
        notify({
          type: SUCCESS_NOTIFICATION,
          message:
            "Registration successful! Please check your email to verify your account.",
        })
      );
    },
    onError: (error) => {
      dispatch(
        notify({
          type: ERROR_NOTIFICATION,
          message: `Registration failed: ${
            error.response?.data?.message || error.message
          }`,
        })
      );
    },
  });
}
