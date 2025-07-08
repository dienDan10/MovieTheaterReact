import { useMutation, useQueryClient } from "@tanstack/react-query";
import customAxios from "../../../utils/axios-customize";

// Deprecated: No longer used. Safe to delete.
export function useDeleteMovie() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      return customAxios.delete(`/api/movies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
  });
}
