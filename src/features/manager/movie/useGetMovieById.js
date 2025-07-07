import { useQuery } from "@tanstack/react-query";
import customAxios from "../../../utils/axios-customize";

export function useGetMovieById(id) {
  const { data, isPending, error } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => customAxios.get(`/api/movies/${id}`),
    enabled: !!id,
  });

  return { movie: data?.data?.data, isPending, error };
}
