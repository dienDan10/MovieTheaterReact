import { useMutation, useQueryClient } from "@tanstack/react-query";
import { disableSeat } from "../../../services/apiSeat";

export const useDisableSeat = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: disableSeat,
    onSuccess: () => {
      // refetch the seats list
      queryClient.invalidateQueries({ queryKey: ["seats"] });
    },
  });

  return { disableSeat: mutate, isPending, error };
};
