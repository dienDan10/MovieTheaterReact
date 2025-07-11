import { useQuery } from "@tanstack/react-query";
import { getAllConcessions } from "../../../services/apiConcession";

export const useGetConcessions = () => {
  return useQuery({
    queryKey: ["concessions"],
    queryFn: () => getAllConcessions(),
    refetchOnWindowFocus: false,
  });
};
