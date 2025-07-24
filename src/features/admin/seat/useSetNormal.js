import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setNormal } from "../../../services/apiSeat";

export const useSetNormal = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: setNormal,
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

  return { setNormal: mutate, isPending, error };
};
