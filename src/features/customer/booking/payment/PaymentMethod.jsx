import React from "react";

function PaymentMethod() {
  return (
    <div className="w-full mx-auto bg-[#f9fbfd] rounded-lg shadow-md text-sm overflow-hidden mt-4">
      <div className="border-b border-gray-200 text-gray-500 font-medium px-5 pt-4 pb-5 bg-stone-200">
        Phương thức thanh toán
      </div>

      <div className="p-5">
        <div className="border border-gray-200 rounded-lg p-4 flex items-center space-x-3 cursor-pointer hover:bg-gray-50">
          <div className="w-6 h-6">
            <input
              type="radio"
              id="vnpay"
              name="paymentMethod"
              className="w-5 h-5 cursor-pointer"
              defaultChecked
            />
          </div>
          <label
            htmlFor="vnpay"
            className="flex items-center cursor-pointer flex-1"
          >
            <span className="font-medium">VNPay</span>
            <img
              src="/images/vnpay-logo.png"
              alt="VNPay Logo"
              className="h-10 ml-auto"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://sandbox.vnpayment.vn/paymentv2/Images/brands/logo.svg";
              }}
            />
          </label>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p>Thanh toán trực tuyến qua cổng thanh toán VNPay</p>
        </div>
      </div>
    </div>
  );
}

export default PaymentMethod;
