import { useQuery } from "@tanstack/react-query";
import { getUserProfileByEmail } from "../../../../services/apiUser";

export const useGetUserProfileByEmail = (email, options = {}) => {
  return useQuery({
    queryKey: ["userProfile", email],
    queryFn: () => getUserProfileByEmail(email),
    enabled: !!email, // Only run the query if email is provided
    retry: false, // Don't retry on error (e.g., for 404 errors)
    ...options,
  });
};
