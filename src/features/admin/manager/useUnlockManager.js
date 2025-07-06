import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unlockManager } from "../../../services/apiManager";

export function useUnlockManager() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unlockManager,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["managers"] });
    },
  });
}
