function TheaterRevenueItem({ theater }) {
  return (
    <div className="flex flex-row items-center justify-between px-4 py-3 border-b border-neutral-200">
      <div className="flex-1/3">
        <p>Rạp</p>
        <p className="uppercase font-semibold">{theater.theaterName}</p>
      </div>
      <div className="flex-1/3 flex flex-col items-center">
        <p>Vé bán ra</p>
        <p className="uppercase font-semibold">{theater.totalTicketCount}</p>
      </div>
      <div className="flex-1/3 flex flex-col items-center">
        <p>Tổng tiền</p>
        <p className="uppercase font-semibold">
          {theater.totalRevenue.toLocaleString("vi-VN")} đ
        </p>
      </div>
    </div>
  );
}

export default TheaterRevenueItem;
