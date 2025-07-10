import { useQuery } from "@tanstack/react-query";
import { getScreens } from "../../../services/apiScreen";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { setFilterScreenId } from "../../../redux/manageShowtimeSlice";

export default function useGetScreens() {
  const { theaterId } = useSelector((state) => state.user.user);
  const filters = useSelector((state) => state.manageShowtime.filters);
  const dispatch = useDispatch();

  const query = useQuery({
    queryKey: ["screens", theaterId],
    queryFn: () => getScreens(theaterId),
    enabled: !!theaterId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (data) => {
      return data?.data || [];
    },
  });

  // Set the first screen as the default screenId when screens are loaded and no screenId is selected yet
  useEffect(() => {
    if (query.data?.length > 0 && !filters.screenId) {
      const firstScreen = query.data[0];
      dispatch(setFilterScreenId(firstScreen.id));
    }
  }, [query.data, filters.screenId, dispatch]);

  return query;
}
