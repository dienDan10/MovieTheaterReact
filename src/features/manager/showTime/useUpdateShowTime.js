import { useMutation, useQueryClient } from "@tanstack/react-query";
import customAxios from "../../../utils/axios-customize";
import { useDispatch } from "react-redux";
import { notify } from "../../../redux/notificationSlice";
import { ERROR_NOTIFICATION, SUCCESS_NOTIFICATION } from "../../../utils/constant";

const useUpdateShowTime = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (data) => {
      return customAxios.put(`/api/showtimes/${data.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["showtimes"] });
      dispatch(
        notify({
          type: SUCCESS_NOTIFICATION,
          message: "ShowTime updated successfully!",
        })
      );
    },
    onError: (error) => {
      dispatch(
        notify({
          type: ERROR_NOTIFICATION,
          message: error.message || "Failed to update showtime",
        })
      );
    },
  });
};

export default useUpdateShowTime;
