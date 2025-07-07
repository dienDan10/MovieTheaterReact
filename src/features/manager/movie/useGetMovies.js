import { useQuery } from "@tanstack/react-query";
import customAxios from "../../../utils/axios-customize";


export function useGetMovies() {
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["movies"],
    queryFn: () => customAxios.get("/api/movies"),
  });

  return { movies: data?.data?.data, isPending, error, refetch };
}
