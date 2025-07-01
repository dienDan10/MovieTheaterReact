import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createManager } from "../../../services/apiManager";

export function useCreateManager() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createManager,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["managers"] });
    },
  });
}
