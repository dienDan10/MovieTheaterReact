import { useQuery } from "@tanstack/react-query";
import { getConcessionById } from "../../../services/apiConcession";

export const useGetConcessionById = (id, enabled = true) => {
  return useQuery({
    queryKey: ["concessions", id],
    queryFn: () => getConcessionById(id),
    enabled: !!id && enabled,
    refetchOnWindowFocus: false,
  });
};
