import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTheater } from "../../../services/apiTheater";
import { useDispatch } from "react-redux";
import { notify } from "../../../redux/notificationSlice";
import {
  ERROR_NOTIFICATION,
  SUCCESS_NOTIFICATION,
} from "../../../utils/constant";

export function useCreateTheater() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: createTheater,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["theaters"] });
      dispatch(
        notify({
          type: SUCCESS_NOTIFICATION,
          message: "Theater created successfully!",
        })
      );
    },
    onError: (error) => {
      dispatch(
        notify({
          type: ERROR_NOTIFICATION,
          message: error.message || "Failed to create theater",
        })
      );
    },
  });
}
