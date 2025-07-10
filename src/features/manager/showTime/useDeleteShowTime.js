import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteShowTime } from "../../../services/apiShowTime";
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

export default function useDeleteShowTime() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (id) => {
      dispatch(setLoading({ key: "delete", value: true }));
      return deleteShowTime(id);
    },

    onSuccess: () => {
      dispatch(
        notify({
          type: SUCCESS_NOTIFICATION,
          message: "Showtime deleted successfully",
        })
      );
      queryClient.invalidateQueries("showtimes");
      dispatch(clearSelectedShowtime());
      dispatch(setLoading({ key: "delete", value: false }));
    },

    onError: (error) => {
      dispatch(
        notify({
          type: ERROR_NOTIFICATION,
          message: `Failed to delete showtime: ${error.message}`,
        })
      );
      dispatch(setLoading({ key: "delete", value: false }));
    },
  });
}
