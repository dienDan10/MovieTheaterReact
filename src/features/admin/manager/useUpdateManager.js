import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateManager } from "../../../services/apiManager";

export function useUpdateManager() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateManager(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["managers"] });
    },
  });
}
