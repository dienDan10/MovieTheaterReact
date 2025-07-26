import { useSelector } from "react-redux";
import PaymentCardItem from "../../../../components/PaymentCardItem";
import {
  MINIMUM_TOTAL_PRICE,
  POINTS_TO_VND_RATIO,
  PROMOTION_TYPE_PERCENTAGE,
  SEAT_TYPE_NORMAL,
  SEAT_TYPE_VIP,
} from "../../../../utils/constant";

function PaymentDescription() {
  const {
    seats,
    concessions,
    showtime,
    selectedPromotion,
    usePoints,
    pointsToUse,
  } = useSelector((state) => state.booking);

  // calculate normal seats and normal seats price
  const normalSeats = seats.filter(
    (seat) => seat.seatType === SEAT_TYPE_NORMAL && seat.isSelected
  );
  const normalSeatsPrice = normalSeats.length * showtime.ticketPrice;

  // calculate vip seats and vip seats price
  const vipSeats = seats.filter(
    (seat) => seat.seatType === SEAT_TYPE_VIP && seat.isSelected
  );
  const vipSeatsPrice = vipSeats.length * showtime.vipTicketPrice;
  // calculate concessions
  const concessionsSelected = concessions.filter(
    (concession) => concession.count > 0
  );

  // Calculate subtotal
  const subtotal =
    normalSeatsPrice +
    vipSeatsPrice +
    concessionsSelected.reduce((total, concession) => {
      return total + concession.price * concession.count;
    }, 0);

  // Calculate promotion discount if there's a selected promotion
  let promotionDiscount = 0;
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

  // Calculate points discount if enabled
  let pointsDiscount = 0;
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

  // Calculate total discount and final price
  const totalDiscount = promotionDiscount + pointsDiscount;
  const totalPrice = Math.max(subtotal - totalDiscount, MINIMUM_TOTAL_PRICE);
  return (
    <div className="w-full mx-auto bg-[#f9fbfd] rounded-lg shadow-md text-sm overflow-hidden">
      <div className="border-b border-gray-200 text-gray-500 font-medium px-5 pt-4 pb-5 bg-stone-200">
        Tóm tắt đơn hàng
      </div>

      <div className="space-y-2">
        {/* Row 1 */}
        <div className="flex justify-between text-gray-700 bg-stone-100 px-5 py-4 border-b border-gray-200">
          <span className="w-1/2 font-medium">MÔ TẢ</span>
          <span className="w-1/4 text-center font-medium">SỐ LƯỢNG</span>
          <span className="w-1/4 text-right font-medium">THÀNH TIỀN</span>
        </div>
        {normalSeats.length > 0 && (
          <PaymentCardItem
            description="Ghế thường"
            quantity={normalSeats.length}
            price={`${
              normalSeatsPrice > 0
                ? new Intl.NumberFormat("vi-VN").format(normalSeatsPrice)
                : 0
            } ₫`}
          />
        )}
        {vipSeats.length > 0 && (
          <PaymentCardItem
            description="Ghế VIP"
            quantity={vipSeats.length}
            price={`${
              vipSeatsPrice > 0
                ? new Intl.NumberFormat("vi-VN").format(vipSeatsPrice)
                : 0
            } ₫`}
          />
        )}
        {concessionsSelected.length > 0 &&
          concessionsSelected.map((concession) => (
            <PaymentCardItem
              key={concession.id}
              description={concession.name}
              quantity={concession.count}
              price={
                new Intl.NumberFormat("vi-VN").format(
                  concession.price * concession.count
                ) + " ₫"
              }
            />
          ))}

        {totalDiscount > 0 && (
          <>
            <PaymentCardItem
              description="Tạm tính"
              quantity={""}
              price={`${new Intl.NumberFormat("vi-VN").format(subtotal)} ₫`}
            />
            {promotionDiscount > 0 && (
              <PaymentCardItem
                description={`Khuyến mãi (${selectedPromotion.description})`}
                quantity={""}
                price={`-${new Intl.NumberFormat("vi-VN").format(
                  promotionDiscount
                )} ₫`}
                isDiscount={true}
              />
            )}
            {pointsDiscount > 0 && (
              <PaymentCardItem
                description={`Điểm tích lũy (${pointsToUse} điểm)`}
                quantity={""}
                price={`-${new Intl.NumberFormat("vi-VN").format(
                  pointsDiscount
                )} ₫`}
                isDiscount={true}
              />
            )}
          </>
        )}

        <PaymentCardItem
          description="Tổng"
          quantity={""}
          price={new Intl.NumberFormat("vi-VN").format(totalPrice) + " đ"}
          isBold={true}
        />
      </div>
    </div>
  );
}

export default PaymentDescription;
