import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../../services/apiUser";

export function useProfile() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    retry: false,
  });

  return {
    data: data?.data,
    isPending,
    isError,
  };
}
