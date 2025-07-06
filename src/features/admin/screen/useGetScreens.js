import { useQuery } from "@tanstack/react-query";
import { getScreens } from "../../../services/apiScreen";

export function useGetScreens(theaterId = "") {
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["screens", theaterId],
    queryFn: () => getScreens(theaterId),
    enabled: true, // Always fetch, even when theaterId is empty
  });

  return {
    screens: data?.data || [],
    isPending,
    error,
    refetch,
  };
}
