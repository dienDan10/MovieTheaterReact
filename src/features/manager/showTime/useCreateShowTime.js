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
    onSuccess: (response) => {
      const results = response.data || [];
      const failed = results.filter((item) => item.success === false);
      const succeeded = results.filter((item) => item.success !== false);
      if (failed.length === results.length) {
        // Tất cả đều thất bại
        const failMsg = failed
          .map(
            (f) =>
              `${f.date ? `Date: ${f.date}` : ""}${
                f.error ? ` - ${f.error}` : ""
              }`
          )
          .join("\n");
        dispatch(
          notify({
            type: ERROR_NOTIFICATION,
            message: failMsg || "Failed to create showtime(s)",
          })
        );
      } else if (failed.length > 0 && succeeded.length > 0) {
        // Một phần thành công, một phần thất bại
        const failMsg = failed
          .map(
            (f) =>
              `${f.date ? `Date: ${f.date}` : ""}${
                f.error ? ` - ${f.error}` : ""
              }`
          )
          .join("\n");
        dispatch(
          notify({
            type: ERROR_NOTIFICATION, // Có thể dùng WARNING_NOTIFICATION nếu bạn có
            message: `Some showtimes created (${succeeded.length}), some failed (${failed.length}):\n${failMsg}`,
          })
        );
        queryClient.invalidateQueries({ queryKey: ["showtimes"] });
      } else {
        // Tất cả thành công
        queryClient.invalidateQueries({ queryKey: ["showtimes"] });
        dispatch(
          notify({
            type: SUCCESS_NOTIFICATION,
            message: "ShowTime(s) created successfully!",
          })
        );
      }
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
