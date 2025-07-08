/* eslint-disable react/prop-types */
function PaymentCardItem({
  description = "VIP",
  quantity = 1,
  price = "50.000 ₫",
}) {
  return (
    <div className="flex justify-between text-gray-800 px-5 py-4 border-b border-gray-200">
      <span className="w-1/2">{description}</span>
      <span className="w-1/4 text-center">{quantity}</span>
      <span className="w-1/4 text-right">{price}</span>
    </div>
  );
}

export default PaymentCardItem;
