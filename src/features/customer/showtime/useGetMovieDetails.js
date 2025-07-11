import { useQuery } from "@tanstack/react-query";
import { getMovieById } from "../../../services/apiMovie";
import { useSelector } from "react-redux";

export const useGetMovieDetails = () => {
  const { movieId } = useSelector((state) => state.showtime);

  return useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => getMovieById(movieId),
    enabled: !!movieId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export default useGetMovieDetails;
