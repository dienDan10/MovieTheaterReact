import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPromotion } from "../../../services/apiPromotion";
import { useDispatch } from "react-redux";
import { notify } from "../../../redux/notificationSlice";
import {
  ERROR_NOTIFICATION,
  SUCCESS_NOTIFICATION,
} from "../../../utils/constant";

export const useCreatePromotion = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: createPromotion,
    onSuccess: () => {
      dispatch(
        notify({
          type: SUCCESS_NOTIFICATION,
          message: "Promotion created successfully",
        })
      );
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
    },
    onError: (error) => {
      dispatch(
        notify({
          type: ERROR_NOTIFICATION,
          message:
            error.response?.data?.message || "Failed to create promotion",
        })
      );
    },
  });
};
