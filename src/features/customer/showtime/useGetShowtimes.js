import { useQuery } from "@tanstack/react-query";
import { getShowtimes } from "../../../services/apiHome";
import { useSelector, useDispatch } from "react-redux";
import { cacheShowtimes } from "../../../redux/showtimeSlice";

export const useGetShowtimes = () => {
  const dispatch = useDispatch();
  const { movieId, provinceId, selectedDate } = useSelector(
    (state) => state.showtime
  );

  return useQuery({
    queryKey: ["showtimes", movieId, provinceId, selectedDate],
    queryFn: async () => {
      const data = await getShowtimes({
        movieId,
        provinceId,
        date: selectedDate,
      });

      // Cache the results in Redux store
      dispatch(
        cacheShowtimes({
          key: `${movieId}-${provinceId}-${selectedDate}`,
          data,
        })
      );

      return data;
    },
    enabled: !!movieId && !!provinceId && !!selectedDate, // Only fetch when all parameters are available
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export default useGetShowtimes;
