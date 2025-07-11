import { useQuery } from "@tanstack/react-query";
import { getAllProvinces } from "../../../services/apiProvince";

export const useGetProvinces = () => {
  return useQuery({
    queryKey: ["provinces"],
    queryFn: async () => {
      const response = await getAllProvinces();
      return response.data;
    },
  });
};

export default useGetProvinces;
