import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enableMovie } from "../../../services/apiMovie";
import { useDispatch } from "react-redux";
import { notify } from "../../../redux/notificationSlice";
import {
  ERROR_NOTIFICATION,
  SUCCESS_NOTIFICATION,
} from "../../../utils/constant";

export function useEnableMovie() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: enableMovie,
    onSuccess: (data, movieId) => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      queryClient.invalidateQueries({ queryKey: ["movie", movieId] });
      dispatch(
        notify({
          type: SUCCESS_NOTIFICATION,
          message: "Movie enabled successfully!",
        })
      );
    },
    onError: (error) => {
      dispatch(
        notify({
          type: ERROR_NOTIFICATION,
          message: error.message || "Failed to enable movie",
        })
      );
    },
  });
}
