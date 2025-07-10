import { Alert, Spin } from "antd";
import DateSelection from "./DateSelection";
import ProvinceSelection from "./ProvinceSelection";
import ShowtimeCard from "./ShowtimeCard";
import useGetShowtimes from "./useGetShowtimes";

function ShowtimeList() {
  const { data: showtimesData, isLoading, error } = useGetShowtimes();
  const theaters = showtimesData?.data || [];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* <!-- Header --> */}
      <h1 className="text-2xl font-semibold text-center mb-6">Lịch chiếu</h1>

      {/* <!-- Location Selection --> */}
      <ProvinceSelection />

      {/* <!-- Date Selection --> */}
      <DateSelection />

      {/* <!-- Loading, Error or No Data States --> */}
      {isLoading && (
        <div className="flex justify-center my-8">
          <Spin size="large" />
        </div>
      )}

      {error && (
        <Alert
          message="Error"
          description="Failed to load showtimes. Please try again later."
          type="error"
          showIcon
          className="my-4"
        />
      )}

      {!isLoading && !error && theaters.length === 0 && (
        <Alert
          message="No Showtimes Available"
          description="There are no showtimes available for the selected date and location."
          type="info"
          showIcon
          className="my-4"
        />
      )}

      {/* <!-- Cinema Listings --> */}
      <div className="space-y-6 mt-6">
        {theaters.map((theater) => (
          <ShowtimeCard key={theater.theaterId} theater={theater} />
        ))}
      </div>
    </div>
  );
}

export default ShowtimeList;
