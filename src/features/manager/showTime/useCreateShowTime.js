import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { notify } from "../../../redux/notificationSlice";
import { ERROR_NOTIFICATION, SUCCESS_NOTIFICATION } from "../../../utils/constant";
import { createShowTimes } from "../../../services/apiShowTime";

const useCreateShowTime = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (data) => {
      // data: { movieId, screenId, showTimes, ticketPrice }
      return createShowTimes(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["showtimes"] });
      dispatch(
        notify({
          type: SUCCESS_NOTIFICATION,
          message: "ShowTime(s) created successfully!",
        })
      );
    },
    onError: (error) => {
      dispatch(
        notify({
          type: ERROR_NOTIFICATION,
          message: error.message || "Failed to create showtime(s)",
        })
      );
    },
  });
};

export default useCreateShowTime;
