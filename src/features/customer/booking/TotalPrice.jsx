import { useSelector } from "react-redux";
import { SEAT_TYPE_NORMAL, SEAT_TYPE_VIP } from "../../../utils/constant";

function TotalPrice() {
  const { seats, showtime, concessions, selectedPromotion } = useSelector(
    (state) => state.booking
  );

  let subtotal = 0;
  let discount = 0;
  let totalPrice = 0;

  if (seats && showtime && concessions) {
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
      if (selectedPromotion.discountType === "Percentage") {
        discount = Math.round(
          subtotal * (selectedPromotion.discountValue / 100)
        );
      } else {
        discount = selectedPromotion.discountValue;
      }
      // Ensure discount doesn't exceed subtotal
      discount = Math.min(discount, subtotal);
    }

    totalPrice = subtotal - discount;
  }

  return (
    <div className="p-4 text-[15px] bg-neutral-50 text-neutral-900 rounded-lg shadow-sm border-2 border-neutral-200">
      <p className="uppercase text-[12px] font-bold text-neutral-400">
        Tổng đơn hàng
      </p>
      <div className="flex flex-col">
        {discount > 0 && (
          <>
            <div className="flex justify-between text-sm">
              <span>Tạm tính:</span>
              <span>{new Intl.NumberFormat("vi-VN").format(subtotal)} ₫</span>
            </div>
            <div className="flex justify-between text-sm text-red-600">
              <span>Giảm giá:</span>
              <span>-{new Intl.NumberFormat("vi-VN").format(discount)} ₫</span>
            </div>
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
