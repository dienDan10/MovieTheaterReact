import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTheater } from "../../../services/apiTheater";
import { useDispatch } from "react-redux";
import { notify } from "../../../redux/notificationSlice";
import {
  ERROR_NOTIFICATION,
  SUCCESS_NOTIFICATION,
} from "../../../utils/constant";

export function useUpdateTheater() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: updateTheater,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["theaters"] });
      queryClient.invalidateQueries({ queryKey: ["theater", variables.id] });
      dispatch(
        notify({
          type: SUCCESS_NOTIFICATION,
          message: "Theater updated successfully!",
        })
      );
    },
    onError: (error) => {
      dispatch(
        notify({
          type: ERROR_NOTIFICATION,
          message: error.message || "Failed to update theater",
        })
      );
    },
  });
}
