import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createScreen } from "../../../services/apiScreen";

export function useCreateScreen() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createScreen,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["screens", variables.theaterId.toString()],
      });
      queryClient.invalidateQueries({
        queryKey: ["screens", ""],
      });
    },
  });
}
