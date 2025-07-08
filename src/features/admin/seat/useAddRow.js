import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addOneRow } from "../../../services/apiSeat";

export const useAddRow = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: addOneRow,
    onSuccess: (_, screenId) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["seats", screenId] });
    },
  });

  return { addRow: mutate, isPending, error };
};
