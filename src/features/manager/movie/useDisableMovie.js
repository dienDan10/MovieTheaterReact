import { useMutation, useQueryClient } from "@tanstack/react-query";
import { disableMovie } from "../../../services/apiMovie";
import { useDispatch } from "react-redux";
import { notify } from "../../../redux/notificationSlice";
import {
  ERROR_NOTIFICATION,
  SUCCESS_NOTIFICATION,
} from "../../../utils/constant";

export function useDisableMovie() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: disableMovie,
    onSuccess: (data, movieId) => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      queryClient.invalidateQueries({ queryKey: ["movie", movieId] });
      dispatch(
        notify({
          type: SUCCESS_NOTIFICATION,
          message: "Movie disabled successfully!",
        })
      );
    },
    onError: (error) => {
      dispatch(
        notify({
          type: ERROR_NOTIFICATION,
          message: error.message || "Failed to disable movie",
        })
      );
    },
  });
}
