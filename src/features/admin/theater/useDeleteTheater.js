import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTheater } from "../../../services/apiTheater";

export function useDeleteTheater() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTheater,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["theaters"] });
    },
  });
}
