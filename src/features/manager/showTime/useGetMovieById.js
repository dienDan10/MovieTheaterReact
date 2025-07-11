import { useQuery } from "@tanstack/react-query";
import { getMovieById } from "../../../services/apiMovie";

export default function useGetMovieById(id) {
  return useQuery({
    queryKey: ["movie", id],
    queryFn: () => getMovieById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => {
      return data?.data || null;
    },
  });
}
