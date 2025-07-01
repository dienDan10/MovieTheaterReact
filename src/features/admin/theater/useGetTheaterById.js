import { useQuery } from "@tanstack/react-query";
import { getTheaterById } from "../../../services/apiTheater";

export function useGetTheaterById(id) {
  const { data, isPending, error } = useQuery({
    queryKey: ["theater", id],
    queryFn: () => getTheaterById(id),
    enabled: !!id,
  });

  return { theater: data?.data, isPending, error };
}
