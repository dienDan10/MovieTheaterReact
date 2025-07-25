import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleUsePoints,
  calculateOptimalPointsToUse,
} from "../../../redux/bookingSlice";
import {
  PROMOTION_TYPE_PERCENTAGE,
  SEAT_TYPE_VIP,
} from "../../../utils/constant";

const POINTS_TO_VND_RATIO = 10; // 1 point = 10 VND

function PointsDiscount() {
  const dispatch = useDispatch();
  const {
    usePoints,
    pointsToUse,
    seats,
    showtime,
    concessions,
    selectedPromotion,
  } = useSelector((state) => state.booking);
  const { user: userInfo } = useSelector((state) => state.user);

  // Calculate points-related values
  const availablePoints = userInfo?.point || 0;
  const pointsValue = Math.round(pointsToUse * POINTS_TO_VND_RATIO); // Value in VND

  // Calculate subtotal and promotion discount for determining optimal points
  let subtotal = 0;
  let promotionDiscount = 0;

  if (seats && showtime && concessions) {
    // Calculate subtotal
    subtotal = seats.reduce((total, seat) => {
      if (!seat.isSelected) return total;
      const price =
        seat.seatType === SEAT_TYPE_VIP
          ? showtime.vipTicketPrice
          : showtime.ticketPrice;
      return total + price;
    }, 0);

    subtotal += concessions.reduce((total, concession) => {
      return total + concession.count * concession.price;
    }, 0);

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
  }

  // Recalculate optimal points when relevant values change
  useEffect(() => {
    if (usePoints && subtotal > 0 && availablePoints > 0) {
      dispatch(
        calculateOptimalPointsToUse({
          subtotal,
          promotionDiscount,
          availablePoints,
        })
      );
    }
  }, [
    dispatch,
    usePoints,
    subtotal,
    promotionDiscount,
    availablePoints,
    selectedPromotion,
  ]);

  const handleTogglePoints = (e) => {
    const checked = e.target.checked;
    dispatch(toggleUsePoints(checked));

    if (checked && subtotal > 0 && availablePoints > 0) {
      // Calculate optimal points to use
      dispatch(
        calculateOptimalPointsToUse({
          subtotal,
          promotionDiscount,
          availablePoints,
        })
      );
    }
  };

  // Don't render if user has no points
  if (!availablePoints) {
    return null;
  }

  return (
    <div className="p-4 text-[15px] bg-neutral-50 text-neutral-900 rounded-lg shadow-sm border-2 border-neutral-200">
      <div className="flex justify-between items-center mb-3">
        <p className="uppercase text-[12px] font-bold text-neutral-400">
          Sử dụng điểm tích lũy
        </p>
        <p className="text-sm">
          <span className="font-medium">Điểm hiện có:</span> {availablePoints}
        </p>
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="use-points"
            checked={usePoints}
            onChange={handleTogglePoints}
            className="mr-3 h-4 w-4 accent-red-700"
          />
          <label htmlFor="use-points" className="cursor-pointer">
            Sử dụng điểm tích lũy
          </label>
        </div>
        {usePoints && (
          <p className="text-sm text-red-700">
            Giảm giá: {new Intl.NumberFormat("vi-VN").format(pointsValue)}đ
          </p>
        )}
      </div>

      {usePoints && (
        <div className="mt-3 text-xs text-gray-500">
          <p>
            Sử dụng {pointsToUse} điểm từ {availablePoints} điểm tích lũy
          </p>
          <p className="mt-1">Còn lại: {availablePoints - pointsToUse} điểm</p>
        </div>
      )}
    </div>
  );
}

export default PointsDiscount;
