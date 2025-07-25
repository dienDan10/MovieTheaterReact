import { useSelector } from "react-redux";
import PaymentCardItem from "../../../../components/PaymentCardItem";
import { SEAT_TYPE_NORMAL, SEAT_TYPE_VIP } from "../../../../utils/constant";

function PaymentDescription() {
  const { seats, concessions, showtime, selectedPromotion } = useSelector(
    (state) => state.booking
  );

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

  // Calculate discount if there's a selected promotion
  let discount = 0;
  if (selectedPromotion) {
    if (selectedPromotion.discountType === "Percentage") {
      discount = Math.round(subtotal * (selectedPromotion.discountValue / 100));
    } else {
      discount = selectedPromotion.discountValue;
    }
    // Ensure discount doesn't exceed subtotal
    discount = Math.min(discount, subtotal);
  }

  // Calculate final total price
  const totalPrice = subtotal - discount;
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

        {discount > 0 && (
          <>
            <PaymentCardItem
              description="Tạm tính"
              quantity={""}
              price={`${new Intl.NumberFormat("vi-VN").format(subtotal)} ₫`}
            />
            <PaymentCardItem
              description={`Khuyến mãi (${selectedPromotion.description})`}
              quantity={""}
              price={`-${new Intl.NumberFormat("vi-VN").format(discount)} ₫`}
              isDiscount={true}
            />
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
