import { useDispatch } from "react-redux";
import { setSelectedShowtime } from "../../../redux/manageShowtimeSlice";

const ShowTimeItem = ({ showtime }) => {
  const dispatch = useDispatch();

  // Format time for display (HH:MM)
  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":");
    return `${hours}:${minutes}`;
  };

  const handleClick = () => {
    if (!isActive) return;
    dispatch(setSelectedShowtime(showtime));
  };

  const checkIsShowtimePast = () => {
    // Get current date and time
    const now = new Date();

    // Parse showtime date and time
    const showtimeDate = new Date(showtime.date);
    const [hours, minutes] = showtime.startTime.split(":").map(Number);

    // Set the hours and minutes on the showtime date
    showtimeDate.setHours(hours, minutes, 0);

    // Compare with current date and time
    return showtimeDate < now;
  };

  const isActive = !checkIsShowtimePast();

  return (
    <div
      onClick={handleClick}
      className={`flex flex-col items-center justify-center text-[14px] px-4 py-1 h-12 rounded-md border-[1px] transition-all duration-200  ${
        isActive
          ? "group border-gray-300 bg-white hover:cursor-pointer hover:bg-red-600 hover:border-red-600 hover:text-white"
          : "bg-gray-200 border-transparent text-gray-500 hover:cursor-not-allowed"
      }`}
    >
      <span>{formatTime(showtime.startTime)}</span>
      {isActive && (
        <span className="font-semibold text-gray-400 text-[12px] group-hover:text-white transition-all duration-200">
          {`${showtime.ticketPrice / 1000}K`}
        </span>
      )}
    </div>
  );
};

export default ShowTimeItem;
