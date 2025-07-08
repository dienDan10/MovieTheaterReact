import { useQuery } from "@tanstack/react-query";
import customAxios from "../../../utils/axios-customize";

const useGetShowTimeById = (id, enabled = true) => {
  return useQuery({
    queryKey: ["showtime", id],
    queryFn: async () => {
      const res = await customAxios.get(`/api/showtimes/${id}`);
      return res.data;
    },
    enabled: !!id && enabled,
  });
};

export default useGetShowTimeById;
