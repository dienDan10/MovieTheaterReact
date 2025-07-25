import { useSelector } from "react-redux";
import {
  MINIMUM_TOTAL_PRICE,
  POINTS_TO_VND_RATIO,
  PROMOTION_TYPE_PERCENTAGE,
  SEAT_TYPE_NORMAL,
  SEAT_TYPE_VIP,
} from "../../../utils/constant";

function TotalPrice() {
  const {
    seats,
    showtime,
    concessions,
    selectedPromotion,
    usePoints,
    pointsToUse,
  } = useSelector((state) => state.booking);

  let subtotal = 0;
  let promotionDiscount = 0;
  let pointsDiscount = 0;
  let totalDiscount = 0;
  let totalPrice = 0;

  if (!seats || !showtime || !concessions) return null;

  seats.forEach((seat) => {
    if (seat.isSelected) {
      if (seat.seatType === SEAT_TYPE_VIP)
        subtotal += showtime?.vipTicketPrice || 0;
      else if (seat.seatType === SEAT_TYPE_NORMAL)
        subtotal += showtime?.ticketPrice || 0;
    }
  });

  concessions.forEach((concession) => {
    if (concession.count > 0) {
      subtotal += concession.price * concession.count;
    }
  });

  // Apply promotion discount if selected
  if (selectedPromotion) {
    if (selectedPromotion.discountType === PROMOTION_TYPE_PERCENTAGE) {
      promotionDiscount = Math.round(
        subtotal * (selectedPromotion.discountValue / 100)
      );
    } else {
      promotionDiscount = selectedPromotion.discountValue;
    }
    // Ensure promotion discount doesn't exceed subtotal
    promotionDiscount = Math.min(promotionDiscount, subtotal);
  }

  // Apply points discount if enabled
  if (usePoints && pointsToUse > 0) {
    // Convert points to VND (100 points = 1000 VND)
    pointsDiscount = Math.round(pointsToUse * POINTS_TO_VND_RATIO);

    // Calculate maximum possible discount while maintaining minimum price
    const maxAllowableDiscount = subtotal - MINIMUM_TOTAL_PRICE;
    const maxPointsDiscount = maxAllowableDiscount - promotionDiscount;

    // Ensure points discount doesn't exceed remaining amount after promotion discount
    // and doesn't make the total go below the minimum price
    pointsDiscount = Math.min(pointsDiscount, Math.max(0, maxPointsDiscount));
  }

  totalDiscount = promotionDiscount + pointsDiscount;
  if (totalDiscount > 0) {
    totalPrice = Math.max(subtotal - totalDiscount, MINIMUM_TOTAL_PRICE);
  } else {
    totalPrice = subtotal;
  }

  return (
    <div className="p-4 text-[15px] bg-neutral-50 text-neutral-900 rounded-lg shadow-sm border-2 border-neutral-200">
      <p className="uppercase text-[12px] font-bold text-neutral-400">
        Tổng đơn hàng
      </p>
      <div className="flex flex-col">
        {totalDiscount > 0 && (
          <>
            <div className="flex justify-between text-sm">
              <span>Tạm tính:</span>
              <span>{new Intl.NumberFormat("vi-VN").format(subtotal)} ₫</span>
            </div>
            {promotionDiscount > 0 && (
              <div className="flex justify-between text-sm text-red-600">
                <span>Khuyến mãi:</span>
                <span>
                  -{new Intl.NumberFormat("vi-VN").format(promotionDiscount)} ₫
                </span>
              </div>
            )}
            {pointsDiscount > 0 && (
              <div className="flex justify-between text-sm text-red-600">
                <span>Điểm tích lũy:</span>
                <span>
                  -{new Intl.NumberFormat("vi-VN").format(pointsDiscount)} ₫
                </span>
              </div>
            )}
          </>
        )}
        <p className="text-2xl text-gray-900 font-semibold mt-1">
          {totalPrice > 0
            ? new Intl.NumberFormat("vi-VN").format(totalPrice)
            : 0}{" "}
          <span className="text-sm align-top">₫</span>
        </p>
      </div>
    </div>
  );
}

export default TotalPrice;
