import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeOneColumn } from "../../../services/apiSeat";

export const useRemoveColumn = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: removeOneColumn,
    onSuccess: (_, screenId) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["seats", screenId] });
    },
  });

  return { removeColumn: mutate, isPending, error };
};
