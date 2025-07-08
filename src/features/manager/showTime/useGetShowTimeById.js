import { useQuery } from "@tanstack/react-query";
import {getShowTimeById} from "../../../services/apiShowTime";

const useGetShowTimeById = (id, enabled = true) => {
  return useQuery({
    queryKey: ["showtime", id],
    queryFn: async () => {
      return await getShowTimeById(id);
    },
    enabled: !!id && enabled,
  });
};

export default useGetShowTimeById;
