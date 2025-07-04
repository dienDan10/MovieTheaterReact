import { useMutation, useQueryClient } from "@tanstack/react-query";
import { lockCustomer } from "../../../services/apiCustomer";

export function useLockCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: lockCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}
