import { SpinnerMedium } from "../../../components/Spinner";
import { useGetActivePromotions } from "./useGetActivePromotions";
import PromotionItem from "./PromotionItem";
import { useSelector } from "react-redux";
import { PROMOTION_TYPE_PERCENTAGE } from "../../../utils/constant";

function PromotionList() {
  const { isLoading, promotions, isError } = useGetActivePromotions();
  const selectedPromotion = useSelector(
    (state) => state.booking.selectedPromotion
  );

  if (isLoading)
    return (
      <div>
        <SpinnerMedium />
      </div>
    );

  if (isError) return <div>Error loading promotions</div>;
  if (!promotions || promotions.length === 0) return null;

  return (
    <div className="p-4 text-[15px] bg-neutral-50 text-neutral-900 rounded-lg shadow-sm border-2 border-neutral-200">
      <div className="flex justify-between items-center mb-3">
        <p className="uppercase text-[12px] font-bold text-neutral-400">
          Khuyến mãi hiện có
        </p>
        {selectedPromotion && (
          <p className="text-sm text-red-700">
            Discount:{" "}
            {selectedPromotion.discountType === PROMOTION_TYPE_PERCENTAGE
              ? `${selectedPromotion.discountValue}%`
              : `${selectedPromotion.discountValue.toLocaleString("vi-VN")} đ`}
          </p>
        )}
      </div>
      <div className="space-y-2">
        {promotions.map((promotion) => (
          <PromotionItem key={promotion.id} promotion={promotion} />
        ))}
      </div>
    </div>
  );
}

export default PromotionList;
