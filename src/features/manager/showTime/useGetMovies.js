import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../../../services/apiMovie";

export default function useGetMovies() {
  return useQuery({
    queryKey: ["movies"],
    queryFn: () => getMovies({}),
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => {
      return data?.data || [];
    },
  });
}
