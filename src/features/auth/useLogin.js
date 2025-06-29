import { useMutation } from "@tanstack/react-query";
import { login as loginApi } from "../../services/apiAuth";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { notify } from "../../redux/notificationSlice";
import { ERROR_NOTIFICATION, SUCCESS_NOTIFICATION } from "../../utils/constant";
import { doGetProfileAction } from "../../redux/userSlice";

export function useLogin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isPending, mutate: login } = useMutation({
    mutationFn: async ({ email, password }) => {
      const response = await loginApi({ email, password });
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(
        notify({
          type: SUCCESS_NOTIFICATION,
          message: "Login Successful",
          description: "You have successfully logged in.",
        })
      );

      dispatch(doGetProfileAction(data.data.user));
      localStorage.setItem("accessToken", data.data.accessToken);
      navigate("/");
    },
    onError: (error) => {
      dispatch(
        notify({
          type: ERROR_NOTIFICATION,
          message: "Login Failed",
          description:
            error.response?.data?.message || "An error occurred during login.",
        })
      );
    },
  });

  return {
    isPending,
    login,
  };
}
