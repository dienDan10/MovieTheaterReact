function ConcessionRevenueItem({ concession }) {
  return (
    <div className="flex flex-row items-center justify-between px-4 py-3 border-b border-neutral-200">
      <div className="flex-1/3">
        <p>COMBO</p>
        <p className="uppercase font-semibold">{concession.name}</p>
      </div>
      <div className="flex-1/3 flex flex-col items-center">
        <p>Số lượng</p>
        <p className="uppercase font-semibold">{concession.totalQuantity}</p>
      </div>
      <div className="flex-1/3 flex flex-col items-center">
        <p>Tổng tiền</p>
        <p className="uppercase font-semibold">
          {concession.totalRevenue.toLocaleString("vi-VN")} đ
        </p>
      </div>
    </div>
  );
}

export default ConcessionRevenueItem;
