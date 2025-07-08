import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeOneRow } from "../../../services/apiSeat";

export const useRemoveRow = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: removeOneRow,
    onSuccess: (_, screenId) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["seats", screenId] });
    },
  });

  return { removeRow: mutate, isPending, error };
};
