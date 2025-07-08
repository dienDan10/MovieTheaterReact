import { useSelector } from "react-redux";

function SeatRows() {
  const { seatRows } = useSelector((state) => state.booking);
  return (
    <div className="flex flex-col gap-2">
      {seatRows.map((row, index) => (
        <span key={index} className="w-8 h-8 pt-1 bg-neutral-500 text-center">
          {row}
        </span>
      ))}
    </div>
  );
}

export default SeatRows;
