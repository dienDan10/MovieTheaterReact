import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { selectSeat } from "../../../../redux/bookingSlice";

function SeatItem({ seat }) {
  const dispatch = useDispatch();

  const handleSeatClick = () => {
    if (seat.isBooked) return;
    dispatch(selectSeat(seat.id));
  };

  const getClassName = () => {
    let baseClasses =
      "flex items-center justify-center w-8 h-8 rounded-md cursor-pointer transition-all duration-200";

    if (seat.isBooked)
      return `${baseClasses} bg-repeating-stripe cursor-not-allowed!`;

    if (seat.isSelected)
      return `${baseClasses} bg-green-500 hover:bg-green-600 shadow-[0_0_11px_rgba(0,179,0,1)]`;

    return `${baseClasses} bg-red-500 hover:bg-red-600`;
  };

  return (
    <div
      className={getClassName()}
      onClick={handleSeatClick}
    >{`${seat.seatRow}${seat.seatNumber}`}</div>
  );
}

SeatItem.propTypes = {
  seat: PropTypes.shape({
    id: PropTypes.number.isRequired,
    seatRow: PropTypes.string.isRequired,
    seatNumber: PropTypes.number.isRequired,
    isActive: PropTypes.bool.isRequired,
    isBooked: PropTypes.bool.isRequired,
    isSelected: PropTypes.bool.isRequired,
  }).isRequired,
};

export default SeatItem;
