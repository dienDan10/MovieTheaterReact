import { useSelector } from "react-redux";

function TotalPrice() {
  const { seats, showtime, concessions } = useSelector(
    (state) => state.booking
  );

  let totalPrice = 0;
  if (seats && showtime && concessions) {
    seats.forEach((seat) => {
      if (seat.isSelected) {
        totalPrice += showtime?.ticketPrice || 0; // Assuming showtime has a price property
      }
    });

    concessions.forEach((concession) => {
      if (concession.count > 0) {
        totalPrice += concession.price * concession.count; // Assuming each concession has a price and count
      }
    });
  }

  return (
    <div className="p-4 text-[15px] bg-neutral-50 text-neutral-900 rounded-lg shadow-sm border-2 border-neutral-200">
      <p className="uppercase text-[12px] font-bold text-neutral-400">
        Tổng đơn hàng
      </p>
      <p className="text-2xl text-gray-900 font-semibold">
        {totalPrice > 0 ? new Intl.NumberFormat("vi-VN").format(totalPrice) : 0}{" "}
        <span className="text-sm align-top">₫</span>
      </p>
    </div>
  );
}

export default TotalPrice;
