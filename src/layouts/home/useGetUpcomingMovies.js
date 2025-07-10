import { useQuery } from "@tanstack/react-query";
import { getUpcomingMovies } from "../../services/apiHome";

export const useGetUpcomingMovies = () => {
  return useQuery({
    queryKey: ["upcomingMovies"],
    queryFn: getUpcomingMovies,
  });
};

export default useGetUpcomingMovies;
