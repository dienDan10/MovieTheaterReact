function TotalPrice() {
  return (
    <div className="p-4 text-[15px] bg-neutral-50 text-neutral-900 rounded-lg shadow-sm border-2 border-neutral-200">
      <p className="uppercase text-[12px] font-bold text-neutral-400">
        Tổng đơn hàng
      </p>
      <p className="text-2xl text-gray-900 font-semibold">
        118.000 <span className="text-sm align-top">₫</span>
      </p>
    </div>
  );
}

export default TotalPrice;
