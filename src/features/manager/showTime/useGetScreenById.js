import { useQuery } from "@tanstack/react-query";
import { getScreenById } from "../../../services/apiScreen";

export default function useGetScreenById(id) {
  return useQuery({
    queryKey: ["screen", id],
    queryFn: () => getScreenById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => {
      return data?.data || null;
    },
  });
}
