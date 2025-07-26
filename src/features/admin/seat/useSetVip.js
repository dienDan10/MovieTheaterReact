import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setVip } from "../../../services/apiSeat";

export const useSetVip = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: setVip,
    onSuccess: () => {
      // Find which screen this seat belongs to by looking at the cache
      const queryCache = queryClient.getQueryCache();
      const seatsQueries = queryCache.findAll({
        queryKey: ["seats"],
      });

      // Invalidate all seats queries to ensure we get the updated data
      seatsQueries.forEach((query) => {
        queryClient.invalidateQueries({ queryKey: query.queryKey });
      });
    },
  });

  return { setVip: mutate, isPending, error };
};
