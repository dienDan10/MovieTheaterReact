import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMovie } from "../../../services/apiMovie";
import { useDispatch } from "react-redux";
import { notify } from "../../../redux/notificationSlice";
import {
  ERROR_NOTIFICATION,
  SUCCESS_NOTIFICATION,
} from "../../../utils/constant";

export function useCreateMovie() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: createMovie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      dispatch(
        notify({
          type: SUCCESS_NOTIFICATION,
          message: "Movie created successfully!",
        })
      );
    },
    onError: (error) => {
      dispatch(
        notify({
          type: ERROR_NOTIFICATION,
          message: error.message || "Failed to create movie",
        })
      );
    },
  });
}
