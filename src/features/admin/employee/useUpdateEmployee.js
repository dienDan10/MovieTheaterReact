import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEmployee } from "../../../services/apiEmployee";

export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
}
