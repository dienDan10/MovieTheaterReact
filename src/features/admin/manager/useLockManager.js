import { useMutation, useQueryClient } from "@tanstack/react-query";
import { lockManager } from "../../../services/apiManager";

export function useLockManager() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: lockManager,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["managers"] });
    },
  });
}
