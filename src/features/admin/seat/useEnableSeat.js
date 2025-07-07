import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enableSeat } from "../../../services/apiSeat";

export const useEnableSeat = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: enableSeat,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["seats"] });
    },
  });

  return { enableSeat: mutate, isPending, error };
};
