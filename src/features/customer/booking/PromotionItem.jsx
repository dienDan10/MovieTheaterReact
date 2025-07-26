import { useDispatch, useSelector } from "react-redux";
import { setSelectedPromotion } from "../../../redux/bookingSlice";
import { PROMOTION_TYPE_PERCENTAGE } from "../../../utils/constant";

function PromotionItem({ promotion }) {
  const dispatch = useDispatch();
  const selectedPromotion = useSelector(
    (state) => state.booking.selectedPromotion
  );
  const isSelected = selectedPromotion?.id === promotion.id;

  const handleSelectPromotion = () => {
    if (isSelected) {
      // If already selected, deselect it
      dispatch(setSelectedPromotion(null));
    } else {
      // Select this promotion
      dispatch(setSelectedPromotion(promotion));
    }
  };

  return (
    <div className="flex items-center justify-between p-3 border border-neutral-200 rounded-md mb-2 hover:bg-neutral-100 transition-colors">
      <div className="flex items-center flex-1">
        <input
          type="checkbox"
          id={`promotion-${promotion.id}`}
          checked={isSelected}
          onChange={handleSelectPromotion}
          className="mr-3 h-4 w-4 accent-red-700"
        />
        <label
          htmlFor={`promotion-${promotion.id}`}
          className="flex flex-col cursor-pointer flex-1"
        >
          <span className="font-medium">Khuyến mãi #{promotion.id}</span>
          <span className="text-sm text-neutral-500">
            {promotion.description}
          </span>
          <span className="text-sm font-bold text-red-700">
            {promotion.discountType === PROMOTION_TYPE_PERCENTAGE
              ? `${promotion.discountValue}% off`
              : `${promotion.discountValue.toLocaleString("vi-VN")}đ off`}
          </span>
          <span className="text-xs text-neutral-400">
            {new Date(promotion.startDate).toLocaleDateString("vi-VN")} -{" "}
            {new Date(promotion.endDate).toLocaleDateString("vi-VN")}
          </span>
        </label>
      </div>
      {promotion.code && (
        <div className="bg-neutral-100 px-3 py-1 rounded text-sm font-mono">
          {promotion.code}
        </div>
      )}
    </div>
  );
}

export default PromotionItem;
