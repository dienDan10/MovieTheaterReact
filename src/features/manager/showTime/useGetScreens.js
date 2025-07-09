import { useQuery } from "@tanstack/react-query";
import customAxios from "../../../utils/axios-customize";

const useGetScreens = (theaterId) => {
  return useQuery({
    queryKey: ["screens", theaterId],
    queryFn: async () => {
      const res = await customAxios.get(`/api/screens${theaterId ? `?theaterId=${theaterId}` : ''}`);
      return res.data;
    },
    enabled: theaterId !== undefined && theaterId !== null,
  });
};

export default useGetScreens;
