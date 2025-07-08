import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enableScreen } from "../../../services/apiScreen";

export function useEnableScreen() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: enableScreen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["screens"] });
    },
  });
}
