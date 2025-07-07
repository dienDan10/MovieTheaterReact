import { decreaseStep, increaseStep } from "../../../redux/bookingSlice";
import Description from "./Description";
import TotalPrice from "./TotalPrice";
import { HiArrowLongLeft } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";

function BookingDetails() {
  const { step, seats } = useSelector((state) => state.booking);
  const dispatch = useDispatch();

  const handleBackBtnClick = () => {
    dispatch(decreaseStep());
  };

  const handleContinueBtnClick = () => {
    if (step < 3) {
      dispatch(increaseStep());
    }
  };

  const haveSelectedSeats = seats.filter((seat) => seat.isSelected).length > 0;

  return (
    <div className="flex-1 flex flex-col gap-6">
      <Description />
      <TotalPrice />
      <div className="flex flex-row justify-between items-center gap-5">
        <button
          className={`flex-1 flex items-center justify-center px-6 py-2 border-1 rounded-lg border-neutral-300 transition-colors duration-200 ${
            step > 1
              ? "hover:cursor-pointer hover:border-red-700 hover:bg-red-700 hover:text-white"
              : "cursor-not-allowed text-neutral-500"
          }`}
          disabled={step === 1}
          onClick={handleBackBtnClick}
        >
          <HiArrowLongLeft className="text-2xl" />
        </button>
        <button
          className={`flex-3 text-center px-6 py-2 border-1 rounded-lg transition-colors duration-200 ${
            haveSelectedSeats
              ? "border-red-700 bg-red-700 text-white hover:cursor-pointer hover:bg-red-800"
              : "border-neutral-300 bg-neutral-50 text-neutral-500 hover:cursor-not-allowed"
          }`}
          onClick={handleContinueBtnClick}
          disabled={!haveSelectedSeats}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

export default BookingDetails;
