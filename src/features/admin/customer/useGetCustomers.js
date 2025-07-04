import { useQuery } from "@tanstack/react-query";
import { getAllCustomers } from "../../../services/apiCustomer";
import { useSelector } from "react-redux";

export function useGetCustomers() {
  const filters = useSelector((state) => state.customer.filters);

  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["customers", filters],
    queryFn: () => getAllCustomers(filters),
  });

  return {
    customers: data?.data?.customers,
    totalCount: data?.data?.totalCount,
    isPending,
    error,
    refetch,
  };
}
