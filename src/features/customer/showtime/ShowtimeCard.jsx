import { Card } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import Showtime from "./Showtime";
import { useSelector } from "react-redux";
function ShowtimeCard({ theater }) {
  const { selectedDate } = useSelector((state) => state.showtime);
  if (!theater) return null;

  const checkIsShowtimePast = (showtime) => {
    // Get current date and time
    const now = new Date();

    // Parse showtime date and time
    const showtimeDate = new Date(selectedDate);
    const [hours, minutes] = showtime.startTime.split(":").map(Number);

    // Set the hours and minutes on the showtime date
    showtimeDate.setHours(hours, minutes, 0);

    // Compare with current date and time
    return showtimeDate < now;
  };

  return (
    <Card className="rounded-lg shadow-md">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-red-600">
          {theater.theaterName}
        </h3>
        <p className="text-gray-600 flex items-start mt-1">
          <EnvironmentOutlined className="mt-1 mr-1 flex-shrink-0" />
          <span>{theater.theaterAddress}</span>
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {theater.showTimes.map((showtime) => (
          <Showtime
            key={showtime.id}
            id={showtime.id}
            time={showtime.startTime}
            price={`${showtime.ticketPrice / 1000}K`}
            isActive={!checkIsShowtimePast(showtime)}
          />
        ))}
      </div>
    </Card>
  );
}

export default ShowtimeCard;
