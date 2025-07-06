import { useQuery } from "@tanstack/react-query";
import { getAllEmployees } from "../../../services/apiEmployee";
import { useSelector } from "react-redux";

export function useGetEmployees() {
  const filters = useSelector((state) => state.employee.filters);

  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["employees", filters],
    queryFn: () => getAllEmployees(filters),
  });

  return {
    employees: data?.data?.employees,
    totalCount: data?.data?.totalCount,
    isPending,
    error,
    refetch,
  };
}
