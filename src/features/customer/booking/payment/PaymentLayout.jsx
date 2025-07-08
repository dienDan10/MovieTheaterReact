import PaymentCardItem from "../../../../components/PaymentCardItem";

function PaymentLayout() {
  return (
    <div className="flex-[2]">
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
          <PaymentCardItem description="Ghế" quantity={3} price="100.000 ₫" />
          <PaymentCardItem
            description="Phí tiện ích"
            quantity={""}
            price="2.500 ₫"
          />
          <PaymentCardItem description="Tổng" quantity={""} price="52.500 ₫" />
        </div>
      </div>
    </div>
  );
}

export default PaymentLayout;
