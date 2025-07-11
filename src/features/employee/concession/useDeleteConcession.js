import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteConcession } from "../../../services/apiConcession";
import { useDispatch } from "react-redux";
import { notify } from "../../../redux/notificationSlice";
import {
  ERROR_NOTIFICATION,
  SUCCESS_NOTIFICATION,
} from "../../../utils/constant";

export const useDeleteConcession = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: deleteConcession,
    onSuccess: () => {
      dispatch(
        notify({
          type: SUCCESS_NOTIFICATION,
          message: "Concession deleted successfully",
        })
      );
      queryClient.invalidateQueries({ queryKey: ["concessions"] });
    },
    onError: (error) => {
      dispatch(
        notify({
          type: ERROR_NOTIFICATION,
          message:
            error.response?.data?.message || "Failed to delete concession",
        })
      );
    },
  });
};
