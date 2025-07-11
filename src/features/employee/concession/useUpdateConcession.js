import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateConcession } from "../../../services/apiConcession";
import { useDispatch } from "react-redux";
import { notify } from "../../../redux/notificationSlice";
import {
  ERROR_NOTIFICATION,
  SUCCESS_NOTIFICATION,
} from "../../../utils/constant";

export const useUpdateConcession = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: updateConcession,
    onSuccess: (_, variables) => {
      dispatch(
        notify({
          type: SUCCESS_NOTIFICATION,
          message: "Concession updated successfully",
        })
      );
      queryClient.invalidateQueries({ queryKey: ["concessions"] });
      queryClient.invalidateQueries({
        queryKey: ["concessions", variables.id],
      });
    },
    onError: (error) => {
      dispatch(
        notify({
          type: ERROR_NOTIFICATION,
          message:
            error.response?.data?.message || "Failed to update concession",
        })
      );
    },
  });
};
