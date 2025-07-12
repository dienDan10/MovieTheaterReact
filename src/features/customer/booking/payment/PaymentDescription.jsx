import { useSelector } from "react-redux";
import PaymentCardItem from "../../../../components/PaymentCardItem";

function PaymentDescription() {
  const { seats, concessions, showtime } = useSelector(
    (state) => state.booking
  );

  const seatsSelected = seats.filter((seat) => seat.isSelected);
  const concessionsSelected = concessions.filter(
    (concession) => concession.count > 0
  );

  const totalSeatsPrice = seatsSelected.length * showtime.ticketPrice;
  const totalPrice =
    totalSeatsPrice +
    concessionsSelected.reduce((total, concession) => {
      return total + concession.price * concession.count;
    }, 0);
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
        <PaymentCardItem
          description="Ghế"
          quantity={seatsSelected.length}
          price={`${
            totalSeatsPrice > 0
              ? new Intl.NumberFormat("vi-VN").format(totalSeatsPrice)
              : 0
          } ₫`}
        />
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

        <PaymentCardItem
          description="Tổng"
          quantity={""}
          price={new Intl.NumberFormat("vi-VN").format(totalPrice) + " đ"}
        />
      </div>
    </div>
  );
}

export default PaymentDescription;
