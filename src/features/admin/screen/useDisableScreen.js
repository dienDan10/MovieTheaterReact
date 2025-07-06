import { useMutation, useQueryClient } from "@tanstack/react-query";
import { disableScreen } from "../../../services/apiScreen";

export function useDisableScreen() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: disableScreen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["screens"] });
    },
  });
}
