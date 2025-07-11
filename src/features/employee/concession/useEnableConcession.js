import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enableConcession } from "../../../services/apiConcession";
import { useDispatch } from "react-redux";
import { notify } from "../../../redux/notificationSlice";
import {
  ERROR_NOTIFICATION,
  SUCCESS_NOTIFICATION,
} from "../../../utils/constant";

export const useEnableConcession = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: enableConcession,
    onSuccess: (_, id) => {
      dispatch(
        notify({
          type: SUCCESS_NOTIFICATION,
          message: "Concession enabled successfully",
        })
      );
      queryClient.invalidateQueries({ queryKey: ["concessions"] });
      queryClient.invalidateQueries({ queryKey: ["concessions", id] });
    },
    onError: (error) => {
      dispatch(
        notify({
          type: ERROR_NOTIFICATION,
          message:
            error.response?.data?.message || "Failed to enable concession",
        })
      );
    },
  });
};
