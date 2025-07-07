import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addOneColumn } from "../../../services/apiSeat";

export const useAddColumn = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: addOneColumn,
    onSuccess: (_, screenId) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["seats", screenId] });
    },
  });

  return { addColumn: mutate, isPending, error };
};
