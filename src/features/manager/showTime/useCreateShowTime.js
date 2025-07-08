import { useMutation, useQueryClient } from "@tanstack/react-query";
import customAxios from "../../../utils/axios-customize";
import { useDispatch } from "react-redux";
import { notify } from "../../../redux/notificationSlice";
import { ERROR_NOTIFICATION, SUCCESS_NOTIFICATION } from "../../../utils/constant";

const useCreateShowTime = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (data) => {
      return customAxios.post("/api/showtimes", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["showtimes"] });
      dispatch(
        notify({
          type: SUCCESS_NOTIFICATION,
          message: "ShowTime created successfully!",
        })
      );
    },
    onError: (error) => {
      dispatch(
        notify({
          type: ERROR_NOTIFICATION,
          message: error.message || "Failed to create showtime",
        })
      );
    },
  });
};

export default useCreateShowTime;
