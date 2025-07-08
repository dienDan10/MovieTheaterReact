import { useQuery } from "@tanstack/react-query";
import { getMovieById } from "../../../services/apiMovie";

export function useGetMovieById(id) {
  const { data, isPending, error } = useQuery({
    queryKey: ["movie", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await getMovieById(id);
      return res.data;
    },
    enabled: !!id,
  });

  return { movie: data, isPending, error };
}
