import { useQuery } from "@tanstack/react-query";
import customAxios from "../../../utils/axios-customize";

const useGetScreens = () => {
  return useQuery({
    queryKey: ["screens"],
    queryFn: async () => {
      const res = await customAxios.get("/api/screens");
      return res.data;
    },
  });
};

export default useGetScreens;
