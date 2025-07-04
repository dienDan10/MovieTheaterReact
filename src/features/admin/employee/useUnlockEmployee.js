import { useMutation, useQueryClient } from "@tanstack/react-query";
import { unlockEmployee } from "../../../services/apiEmployee";

export function useUnlockEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unlockEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}
