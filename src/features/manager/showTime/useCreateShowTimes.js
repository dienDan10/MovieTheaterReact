import { createShowTimes } from "../../../services/apiShowTime";
import { useDispatch, useSelector } from "react-redux";
import {
  resetNewShowtime,
  setLoading,
} from "../../../redux/manageShowtimeSlice";
import { format } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notify } from "../../../redux/notificationSlice";
import {
  ERROR_NOTIFICATION,
  SUCCESS_NOTIFICATION,
} from "../../../utils/constant";

export default function useCreateShowTimes() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const newShowtime = useSelector((state) => state.manageShowtime.newShowtime);

  return useMutation({
    mutationFn: () => {
      // Format data for the API
      const formattedShowTimes = [];
      const date = format(new Date(newShowtime.date), "yyyy-MM-dd");

      // Group time slots by date
      const timeSlots = newShowtime.timeSlots.map((slot) => ({
        startTime: slot.startTime,
        endTime: slot.endTime,
      }));

      // Extract just the time parts for API
      const startTimes = timeSlots.map((slot) => slot.startTime);
      const endTimes = timeSlots.map((slot) => slot.endTime);

      formattedShowTimes.push({
        date,
        startTimes,
        endTimes,
      });

      dispatch(setLoading({ key: "create", value: true }));

      return createShowTimes({
        movieId: newShowtime.movieId,
        screenId: newShowtime.screenId,
        showTimes: formattedShowTimes,
        ticketPrice: newShowtime.ticketPrice,
      });
    },

    onSuccess: () => {
      dispatch(
        notify({
          type: SUCCESS_NOTIFICATION,
          message: "Showtimes created successfully",
        })
      );
      queryClient.invalidateQueries("showtimes");
      dispatch(resetNewShowtime());
      dispatch(setLoading({ key: "create", value: false }));
    },

    onError: (error) => {
      dispatch(
        notify({
          type: ERROR_NOTIFICATION,
          message: `Failed to create showtimes: ${error.message}`,
        })
      );
      dispatch(setLoading({ key: "create", value: false }));
    },
  });
}
