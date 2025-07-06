import { useQuery } from "@tanstack/react-query";
import { getAllManagers } from "../../../services/apiManager";

export function useGetManagers() {
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["managers"],
    queryFn: getAllManagers,
  });

  return { managers: data?.data, isPending, error, refetch };
}
