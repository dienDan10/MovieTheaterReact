import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateShowTime } from "../../../services/apiShowTime";
import { useDispatch } from "react-redux";
import {
  clearSelectedShowtime,
  setLoading,
} from "../../../redux/manageShowtimeSlice";
import { notify } from "../../../redux/notificationSlice";
import {
  ERROR_NOTIFICATION,
  SUCCESS_NOTIFICATION,
} from "../../../utils/constant";

export default function useUpdateShowTime() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({ id, startTime, endTime, ticketPrice, vipTicketPrice }) => {
      dispatch(setLoading({ key: "update", value: true }));
      return updateShowTime({
        id,
        startTime,
        endTime,
        ticketPrice,
        vipTicketPrice,
      });
    },

    onSuccess: () => {
      dispatch(
        notify({
          type: SUCCESS_NOTIFICATION,
          message: "Showtime updated successfully",
        })
      );
      queryClient.invalidateQueries("showtimes");
      dispatch(clearSelectedShowtime());
      dispatch(setLoading({ key: "update", value: false }));
    },

    onError: (error) => {
      dispatch(
        notify({
          type: ERROR_NOTIFICATION,
          message: `Failed to update showtime: ${error.message}`,
        })
      );
      dispatch(setLoading({ key: "update", value: false }));
    },
  });
}
