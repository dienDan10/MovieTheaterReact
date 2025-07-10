import React from "react";
import { Typography, Tabs, Empty, Spin } from "antd";
import ShowTimeFilter from "./ShowTimeFilter";
import AddShowtimeForm from "./AddShowtimeForm";
import ShowtimeCard from "./ShowtimeCard";
import ShowTimeDetail from "./ShowTimeDetail";
import useGetShowTimes from "./useGetShowTimes";
import { groupBy } from "lodash";

const { Title } = Typography;

function ShowTimeLayout() {
  const { data: showtimes = [], isLoading, isError } = useGetShowTimes();

  // Group showtimes by date
  const groupedShowtimes = groupBy(showtimes, "date");

  // Render loading state
  if (isLoading) {
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
    <div className="p-4">
      <Title level={3}>Manage Showtimes</Title>

      <Tabs
        defaultActiveKey="showtimes"
        items={[
          {
            key: "showtimes",
            label: "Showtimes",
            children: (
              <>
                <ShowTimeFilter />
                {showTimesEmpty ? (
                  <Empty
                    description="No showtimes found for the selected filters"
                    className="my-12"
                  />
                ) : (
                  Object.entries(groupedShowtimes).map(
                    ([date, dateShowtimes]) => {
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
                    }
                  )
                )}
                <ShowTimeDetail />
              </>
            ),
          },
          {
            key: "add",
            label: "Add Showtimes",
            children: <AddShowtimeForm />,
          },
        ]}
      />
    </div>
  );
}

export default ShowTimeLayout;
