import { useQuery } from "@tanstack/react-query";
import { getShowTimes } from "../../../services/apiShowTime";

// Thêm movieId, screenId vào params
const useGetShowTimes = (dateRange, movieId, screenId) => {
  // dateRange: [startDayjs, endDayjs]
  return useQuery({
    queryKey: [
      "showtimes",
      dateRange?.[0]?.format("YYYY-MM-DD"),
      dateRange?.[1]?.format("YYYY-MM-DD"),
      movieId || null,
      screenId || null
    ],
    queryFn: async () => {
      let startDate, endDate;
      if (Array.isArray(dateRange) && dateRange.length === 2) {
        // Only pass date part (no time)
        startDate = dateRange[0]?.format("YYYY-MM-DD");
        endDate = dateRange[1]?.format("YYYY-MM-DD");
      }
      console.log("[useGetShowTimes] startDate:", startDate, "endDate:", endDate, "movieId:", movieId, "screenId:", screenId);
      return await getShowTimes({ startDate, endDate, movieId, screenId });
    },
    keepPreviousData: true,
  });
};

export default useGetShowTimes;
