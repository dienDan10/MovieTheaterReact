import { useQuery } from "@tanstack/react-query";
import customAxios from "../../../utils/axios-customize";

const useGetShowTimes = () => {
  return useQuery({
    queryKey: ["showtimes"],
    queryFn: async () => {
      const res = await customAxios.get("/api/showtimes");
      return res.data;
    },
  });
};

export default useGetShowTimes;
