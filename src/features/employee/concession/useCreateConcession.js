import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createConcession } from "../../../services/apiConcession";
import { useDispatch } from "react-redux";
import { notify } from "../../../redux/notificationSlice";
import {
  ERROR_NOTIFICATION,
  SUCCESS_NOTIFICATION,
} from "../../../utils/constant";

export const useCreateConcession = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: createConcession,
    onSuccess: () => {
      dispatch(
        notify({
          type: SUCCESS_NOTIFICATION,
          message: "Concession created successfully",
        })
      );
      queryClient.invalidateQueries({ queryKey: ["concessions"] });
    },
    onError: (error) => {
      dispatch(
        notify({
          type: ERROR_NOTIFICATION,
          message:
            error.response?.data?.message || "Failed to create concession",
        })
      );
    },
  });
};
