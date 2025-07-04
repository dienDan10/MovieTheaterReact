import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEmployee } from "../../../services/apiEmployee";

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}
