import { useQuery } from "@tanstack/react-query";
import { getCurrentAiringMovies } from "../../services/apiHome";

export const useGetAiringMovies = () => {
  return useQuery({
    queryKey: ["airingMovies"],
    queryFn: getCurrentAiringMovies,
  });
};

export default useGetAiringMovies;
