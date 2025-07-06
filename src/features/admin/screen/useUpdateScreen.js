import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateScreen } from "../../../services/apiScreen";

export function useUpdateScreen() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateScreen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["screens"] });
    },
  });
}
