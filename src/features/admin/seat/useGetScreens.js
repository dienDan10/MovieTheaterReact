import { useQuery } from "@tanstack/react-query";
import { getScreens } from "../../../services/apiScreen";

export const useGetScreens = (theaterId) => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["screens", theaterId],
    queryFn: () => getScreens(theaterId),
    enabled: !!theaterId, // Only run the query if we have a theaterId
    select: (data) => {
      return (
        data?.data?.map((screen) => ({
          value: screen.id,
          label: screen.name,
          ...screen,
        })) || []
      );
    },
  });

  return { screens: data || [], isLoading, error, refetch };
};
