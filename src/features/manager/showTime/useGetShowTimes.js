import { useQuery } from "@tanstack/react-query";
import { getShowTimes } from "../../../services/apiShowTime";

const useGetShowTimes = (dateRange) => {
  // dateRange: [startDayjs, endDayjs]
  return useQuery({
    queryKey: ["showtimes", dateRange?.[0]?.format("YYYY-MM-DD"), dateRange?.[1]?.format("YYYY-MM-DD")],
    queryFn: async () => {
      let startDate, endDate;
      if (Array.isArray(dateRange) && dateRange.length === 2) {
        // Only pass date part (no time)
        startDate = dateRange[0]?.format("YYYY-MM-DD");
        endDate = dateRange[1]?.format("YYYY-MM-DD");
      }
      console.log("[useGetShowTimes] startDate:", startDate, "endDate:", endDate);
      return await getShowTimes({ startDate, endDate });
    },
    keepPreviousData: true,
  });
};

export default useGetShowTimes;
