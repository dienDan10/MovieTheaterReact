import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../../../../redux/employeeBookingSlice";
import DateSelection from "./DateSelection";
import useGetShowTimes from "./useGetShowtimes";
import { Empty, Spin, Typography } from "antd";
import { groupBy } from "lodash";
import ShowtimeCard from "./ShowtimeCard";

const { Title } = Typography;

function ShowtimeLayout() {
  const { data: showtimes = [], isPending, isError } = useGetShowTimes();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { filters } = useSelector((state) => state.employeeBooking);
  const theaterId = user.theaterId;

  useEffect(() => {
    // Only set initial filters when component mounts
    if (!filters.date) {
      const today = new Date().toISOString().split("T")[0];
      dispatch(setFilters({ theaterId, date: today }));
    }
  }, [dispatch, theaterId, filters.date]);

  // Group showtimes by date
  const groupedShowtimes = groupBy(showtimes, "date");

  // Render loading state
  if (isPending) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spin size="large" />
      </div>
    );
  }

  // Render error state
  if (isError) {
    return (
      <div className="p-6 text-center">
        <Title level={4} type="danger">
          Failed to load showtimes. Please try again later.
        </Title>
      </div>
    );
  }

  // Render empty state
  const showTimesEmpty = Object.keys(groupedShowtimes).length === 0;

  return (
    <div>
      <DateSelection />
      {showTimesEmpty && (
        <Empty
          description="No showtimes found for the selected date"
          className="my-12"
        />
      )}
      {!showTimesEmpty &&
        Object.entries(groupedShowtimes).map(([date, dateShowtimes]) => {
          // Group by movie for each date
          const groupedByMovie = groupBy(
            dateShowtimes,
            (item) => item.movie.id
          );

          return Object.entries(groupedByMovie).map(
            ([movieId, movieShowtimes]) => {
              const { movie, showTimes } = movieShowtimes[0];
              return (
                <ShowtimeCard
                  key={`${date}-${movieId}`}
                  date={date}
                  movie={movie}
                  showtimes={showTimes}
                />
              );
            }
          );
        })}
    </div>
  );
}

export default ShowtimeLayout;
