import { useSelector } from "react-redux";
import SeatItem from "./SeatItem";

function SeatGrid() {
  const { seatRows, seatColumns, seats } = useSelector(
    (state) => state.booking
  );
  return (
    <div className="flex-1">
      {/* Seats grid */}
      <div className="flex flex-col items-center gap-2">
        {seatRows.map((row) => (
          <div key={row} className="flex items-center">
            {/* Seats for this row */}
            <div className="flex gap-2">
              {seatColumns.map((col) => {
                const seat = seats.find(
                  (s) => s.seatRow === row && s.seatNumber === col
                );

                if (!seat)
                  return (
                    <div key={`empty-${row}-${col}`} className="w-8 h-8"></div>
                  );

                return <SeatItem key={seat.id} seat={seat} />;
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SeatGrid;
