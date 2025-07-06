import { useMutation, useQueryClient } from "@tanstack/react-query";
import { lockUnlockTheater } from "../../../services/apiTheater";

export function useLockUnlockTheater() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: lockUnlockTheater,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["theaters"] });
    },
  });
}
