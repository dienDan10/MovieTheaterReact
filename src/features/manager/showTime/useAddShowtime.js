import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createShowTimes } from "../../../services/apiShowTime";
import { format } from "date-fns";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { notify } from "../../../redux/notificationSlice";
import {
  ERROR_NOTIFICATION,
  SUCCESS_NOTIFICATION,
} from "../../../utils/constant";

export default function useAddShowtime() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: ({
      movieId,
      screenId,
      date,
      startTime,
      ticketPrice,
      movieDuration,
    }) => {
      // Calculate end time based on start time and movie duration
      const formattedStartTime = startTime.format("HH:mm");
      const endTimeObj = dayjs(startTime).add(movieDuration, "minute");
      const formattedEndTime = endTimeObj.format("HH:mm");

      // Format data for API
      const formattedShowTimes = [
        {
          date: format(new Date(date), "yyyy-MM-dd"),
          startTimes: [formattedStartTime],
          endTimes: [formattedEndTime],
        },
      ];

      return createShowTimes({
        movieId,
        screenId,
        showTimes: formattedShowTimes,
        ticketPrice,
      });
    },
    onSuccess: (response) => {
      const successCount = response.data.filter((r) => r.success).length;
      const errorCount = response.data.filter((r) => !r.success).length;
      dispatch(
        notify({
          type: SUCCESS_NOTIFICATION,
          message: "Showtime added",
          description: `${successCount} showtimes added successfully, ${errorCount} failed.`,
        })
      );
      queryClient.invalidateQueries("showtimes");
    },
    onError: (error) => {
      dispatch(
        notify({
          type: ERROR_NOTIFICATION,
          message: `Failed to add showtime: ${error.message}`,
        })
      );
    },
  });
}
