import { format } from "date-fns";
import { useSelector } from "react-redux";

function Description() {
  const { theater, screen, showtime, movie, seats } = useSelector(
    (state) => state.booking
  );

  const selectedSeats = seats
    .filter((seat) => seat.isSelected)
    .map((s) => `${s.seatRow}${s.seatNumber}`)
    .join(", ");

  return (
    <div className="p-4 text-[15px] bg-neutral-50 text-neutral-900 rounded-lg shadow-sm border-2 border-neutral-200">
      <p>{movie?.title}</p>
      <p className="font-semibold">{theater?.name}</p>
      <p>
        Suất{" "}
        <span className="font-semibold">
          {showtime?.startTime?.slice(0, 5)}
          {" - "}
          {showtime?.date && format(new Date(showtime.date), "dd/MM/yyyy")}
        </span>
      </p>
      <p>
        Phòng chiếu <span className="font-semibold">{screen?.name}</span> - Ghế{" "}
        <span className="font-semibold">{selectedSeats || "..."}</span>
      </p>
    </div>
  );
}

export default Description;
