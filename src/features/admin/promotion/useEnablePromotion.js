import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enablePromotion } from "../../../services/apiPromotion";
import { useDispatch } from "react-redux";
import { notify } from "../../../redux/notificationSlice";
import {
  ERROR_NOTIFICATION,
  SUCCESS_NOTIFICATION,
} from "../../../utils/constant";

export const useEnablePromotion = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: enablePromotion,
    onSuccess: (data, variables) => {
      dispatch(
        notify({
          type: SUCCESS_NOTIFICATION,
          message: "Promotion enabled successfully",
        })
      );
      queryClient.invalidateQueries({ queryKey: ["promotions"] });
      queryClient.invalidateQueries({ queryKey: ["promotion", variables] });
    },
    onError: (error) => {
      dispatch(
        notify({
          type: ERROR_NOTIFICATION,
          message:
            error.response?.data?.message || "Failed to enable promotion",
        })
      );
    },
  });
};
