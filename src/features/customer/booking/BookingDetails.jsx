import { decreaseStep, increaseStep } from "../../../redux/bookingSlice";
import Description from "./Description";
import TotalPrice from "./TotalPrice";
import { HiArrowLongLeft } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { notify } from "../../../redux/notificationSlice";
import { ERROR_NOTIFICATION } from "../../../utils/constant";
import { useCreateBooking } from "./useCreateBooking";
import { SpinnerSmall } from "../../../components/Spinner";

function BookingDetails() {
  const { step, seats, theater, screen, showtime, user, concessions } =
    useSelector((state) => state.booking);
  const { user: userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { mutate: createBooking, isPending } = useCreateBooking();
  const { username, phone, email } = user || {};

  const handleBackBtnClick = () => {
    dispatch(decreaseStep());
  };

  const handleContinueBtnClick = () => {
    if (step < 3) {
      dispatch(increaseStep());
      return;
    }

    try {
      validateUserForm();
      // create booking data to send to the server

      const bookingData = {
        userId: userInfo?.id,
        username,
        phone,
        email,
        seats: seats
          .filter((seat) => seat.isSelected)
          .map((seat) => ({
            id: seat.id,
            name: seat.seatRow + seat.seatNumber + "",
            seatType: seat.seatType,
          })),
        theaterId: theater.id,
        screenId: screen.id,
        showtimeId: showtime.id,
        concessions: concessions
          .filter((concession) => concession.count > 0)
          .map((concession) => ({
            id: concession.id,
            quantity: concession.count,
          })),
      };

      createBooking(bookingData);
    } catch (error) {
      dispatch(
        notify({
          type: ERROR_NOTIFICATION,
          message: error.message,
        })
      );
      return;
    }
  };

  const validateUserForm = () => {
    if (!username?.trim()) throw new Error("Vui lòng nhập họ và tên!");
    if (!phone?.match(/^[0-9]{10,11}$/))
      throw new Error("Số điện thoại không hợp lệ!");
    if (email && !email.match(/^[^@]+@[^@]+\.[^@]+$/))
      throw new Error("Email không hợp lệ!");
  };

  const haveSelectedSeats = seats.filter((seat) => seat.isSelected).length > 0;
  const dataLoaded = Boolean(theater && screen && showtime);

  return (
    <div className="flex-1 flex flex-col gap-6 lg:mt-14">
      {dataLoaded ? (
        <Description />
      ) : (
        <div className="p-4 text-[15px] bg-neutral-50 text-neutral-900 rounded-lg shadow-sm border-2 border-neutral-200">
          Loading booking details...
        </div>
      )}
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
          {isPending ? <SpinnerSmall /> : step < 3 ? "Tiếp tục" : "Thanh toán"}
        </button>
      </div>
    </div>
  );
}

export default BookingDetails;
