import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unlockCustomer } from "../../../services/apiCustomer";

export function useUnlockCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unlockCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}
