import { useMutation, useQueryClient } from "@tanstack/react-query";
import { lockEmployee } from "../../../services/apiEmployee";

export function useLockEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: lockEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}
