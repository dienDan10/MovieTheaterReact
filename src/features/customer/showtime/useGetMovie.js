import { useQuery } from "@tanstack/react-query";
import { getMovieById } from "../../../services/apiMovie";

export const useGetMovie = (movieId) => {
  return useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => getMovieById(movieId),
    enabled: !!movieId, // Only fetch when movieId is available
  });
};

export default useGetMovie;
