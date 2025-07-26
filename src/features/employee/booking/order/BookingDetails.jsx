import { useDispatch, useSelector } from "react-redux";
import { decreaseStep, increaseStep } from "../../../../redux/bookingSlice";
import { notify } from "../../../../redux/notificationSlice";
import {
  ERROR_NOTIFICATION,
  MINIMUM_TOTAL_PRICE,
  POINTS_TO_VND_RATIO,
  PROMOTION_TYPE_PERCENTAGE,
  SEAT_TYPE_VIP,
} from "../../../../utils/constant";
import Description from "../../../customer/booking/Description";
import TotalPrice from "../../../customer/booking/TotalPrice";
import { HiArrowLongLeft } from "react-icons/hi2";
import { useCreateBooking } from "./useCreateBooking";
import { SpinnerSmall } from "../../../../components/Spinner";
import PromotionList from "../../../customer/booking/PromotionList";
import SearchUser from "./SearchUser";

function BookingDetails() {
  const {
    step,
    seats,
    theater,
    screen,
    showtime,
    user,
    concessions,
    selectedPromotion,
    usePoints,
    pointsToUse,
  } = useSelector((state) => state.booking);
  const { user: userInfo } = useSelector((state) => state.user);
  const { selectedCustomer } = useSelector((state) => state.employeeBooking);
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

      // Calculate pricing information
      let subtotal = 0;
      let totalDiscount = 0;
      let finalAmount = 0;
      let promotionDiscount = 0;
      let pointsDiscount = 0;

      // Calculate ticket prices
      const selectedSeats = seats.filter((seat) => seat.isSelected);
      selectedSeats.forEach((seat) => {
        if (seat.seatType === SEAT_TYPE_VIP) {
          subtotal += showtime?.vipTicketPrice || 0;
        } else {
          subtotal += showtime?.ticketPrice || 0;
        }
      });

      // Calculate concession prices
      const selectedConcessions = concessions.filter(
        (concession) => concession.count > 0
      );
      selectedConcessions.forEach((concession) => {
        subtotal += concession.price * concession.count;
      });

      // Calculate promotion discount
      if (selectedPromotion) {
        if (selectedPromotion.discountType === PROMOTION_TYPE_PERCENTAGE) {
          promotionDiscount = Math.round(
            subtotal * (selectedPromotion.discountValue / 100)
          );
        } else {
          promotionDiscount = selectedPromotion.discountValue;
        }
        promotionDiscount = Math.min(promotionDiscount, subtotal);
      }

      // Calculate points discount
      if (usePoints && pointsToUse > 0) {
        pointsDiscount = Math.round(pointsToUse * POINTS_TO_VND_RATIO);

        // Calculate maximum possible discount while maintaining minimum price
        const maxAllowableDiscount = subtotal - MINIMUM_TOTAL_PRICE;
        const maxPointsDiscount = maxAllowableDiscount - promotionDiscount;

        // Ensure points discount doesn't exceed allowed amount
        pointsDiscount = Math.min(
          pointsDiscount,
          Math.max(0, maxPointsDiscount)
        );
      }

      totalDiscount = promotionDiscount + pointsDiscount;
      finalAmount = Math.max(subtotal - totalDiscount, MINIMUM_TOTAL_PRICE);

      const bookingData = {
        employeeId: userInfo?.id,
        username,
        phone,
        email,
        ...(selectedCustomer && { userId: selectedCustomer.id }),
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
        promotionId: selectedPromotion?.id || 0,
        pointsUsed: usePoints ? pointsToUse : 0,
        totalAmount: subtotal,
        discountAmount: totalDiscount,
        finalAmount: finalAmount,
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
      {/* Promotions */}
      <PromotionList />

      <SearchUser />
      <div className="flex flex-row justify-between items-center gap-5">
        <button
          className={`flex-1 flex items-center justify-center px-6 py-2 border-1 rounded-lg transition-colors duration-200 ${
            step > 1
              ? "hover:cursor-pointer hover:border-red-700 hover:bg-red-700 hover:text-white text-neutral-700"
              : "cursor-not-allowed text-neutral-400 border-neutral-400"
          }`}
          disabled={step === 1}
          onClick={handleBackBtnClick}
        >
          <HiArrowLongLeft className="text-2xl" />
        </button>
        <button
          className={`flex-3 text-center px-6 py-2 border-1 flex items-center justify-center rounded-lg transition-colors duration-200 ${
            haveSelectedSeats
              ? "border-red-700 bg-red-700 text-white hover:cursor-pointer hover:bg-red-800"
              : "border-neutral-300 bg-neutral-50 text-neutral-500 hover:cursor-not-allowed"
          } disabled:border-neutral-300 disabled:bg-neutral-50 disabled:text-neutral-500`}
          onClick={handleContinueBtnClick}
          disabled={!haveSelectedSeats || isPending}
        >
          {isPending ? <SpinnerSmall /> : step < 3 ? "Tiếp tục" : "Thanh toán"}
        </button>
      </div>
    </div>
  );
}

export default BookingDetails;
