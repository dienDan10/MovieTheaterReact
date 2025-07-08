import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../../../services/apiMovie";
import { useSelector } from "react-redux";

export function useGetMovies() {
  const filters = useSelector((state) => state.movie.filters);

  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["movies", filters],
    queryFn: () => getMovies(filters),
  });

  return {
    movies: data?.data?.movies || [],
    totalCount: data?.data?.totalCount || 0,
    isPending,
    error,
    refetch,
  };
}
