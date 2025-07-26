import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleUsePoints,
  calculateOptimalPointsToUse,
} from "../../../../redux/bookingSlice";
import {
  PROMOTION_TYPE_PERCENTAGE,
  SEAT_TYPE_VIP,
  POINTS_TO_VND_RATIO,
} from "../../../../utils/constant";
import { Card } from "antd";
import { GiftOutlined } from "@ant-design/icons";

function EmployeePointsDiscount({ customerData }) {
  const dispatch = useDispatch();
  const {
    usePoints,
    pointsToUse,
    seats,
    showtime,
    concessions,
    selectedPromotion,
  } = useSelector((state) => state.booking);

  // Calculate points-related values
  const availablePoints = customerData?.point || 0;
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

  const handleTogglePoints = () => {
    const newUsePoints = !usePoints;
    dispatch(toggleUsePoints(newUsePoints));

    if (newUsePoints && subtotal > 0 && availablePoints > 0) {
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

  // Don't render if no customer data or customer has no points
  if (!customerData || !availablePoints) {
    return null;
  }

  return (
    <Card
      title={
        <span>
          <GiftOutlined className="mr-2" /> Customer Points
        </span>
      }
      className="mb-4"
    >
      <div className="flex justify-between items-center mb-3">
        <p className="font-medium">
          Available Points:{" "}
          <span className="text-green-600">{availablePoints}</span>
        </p>
        <p className="text-sm">
          Equivalent to:{" "}
          <span className="font-semibold">
            {(availablePoints * POINTS_TO_VND_RATIO).toLocaleString()} đ
          </span>
        </p>
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="employee-use-points"
            checked={usePoints}
            onChange={handleTogglePoints}
            className="mr-3 h-4 w-4 accent-red-700"
          />
          <label htmlFor="employee-use-points" className="cursor-pointer">
            Apply points to this order
          </label>
        </div>
        {usePoints && (
          <p className="text-sm text-red-700 font-medium">
            Discount: {new Intl.NumberFormat("vi-VN").format(pointsValue)} đ
          </p>
        )}
      </div>

      {usePoints && (
        <div className="mt-3 p-2 bg-gray-50 rounded">
          <div className="flex justify-between text-sm">
            <span>Points used:</span>
            <span className="font-medium">{pointsToUse}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span>Remaining points:</span>
            <span className="font-medium">{availablePoints - pointsToUse}</span>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <p>
              Note: The system automatically calculates the optimal number of
              points to use for this order.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}

export default EmployeePointsDiscount;
