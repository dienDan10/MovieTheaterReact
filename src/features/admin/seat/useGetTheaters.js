import { useQuery } from "@tanstack/react-query";
import { getAllTheaters } from "../../../services/apiTheater";

export const useGetTheaters = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["theaters"],
    queryFn: () => getAllTheaters(),
    select: (data) => {
      return (
        data?.data?.map((theater) => ({
          value: theater.id,
          label: theater.name,
          ...theater,
        })) || []
      );
    },
  });

  return { theaters: data || [], isLoading, error };
};
