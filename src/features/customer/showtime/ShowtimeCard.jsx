import { Card } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import Showtime from "./Showtime";
function ShowtimeCard({ theater }) {
  if (!theater) return null;

  const checkIsShowtimePast = (startTime) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const showtime = new Date();
    showtime.setHours(hours, minutes, 0);
    return showtime < new Date();
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
            isActive={!checkIsShowtimePast(showtime.startTime)}
          />
        ))}
      </div>
    </Card>
  );
}

export default ShowtimeCard;
