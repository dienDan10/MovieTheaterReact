import { Drawer, Descriptions, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleDetailsVisibility,
  clearSelectedPromotion,
} from "../../../redux/promotionSlice";
import { useGetPromotionById } from "./useGetPromotionById";

function PromotionDetail() {
  const dispatch = useDispatch();
  const { detailsVisible, selectedPromotion } = useSelector(
    (state) => state.promotion
  );

  const { data: promotionData, isLoading } = useGetPromotionById(
    selectedPromotion?.id,
    detailsVisible
  );

  const handleClose = () => {
    dispatch(toggleDetailsVisibility(false));
    dispatch(clearSelectedPromotion());
  };

  const promotionDetails = promotionData?.data || selectedPromotion;

  return (
    <Drawer
      title="Promotion Details"
      placement="right"
      onClose={handleClose}
      open={detailsVisible}
      width={500}
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : promotionDetails ? (
        <div className="space-y-6">
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Description">
              {promotionDetails.description}
            </Descriptions.Item>
            <Descriptions.Item label="Discount Type">
              {promotionDetails.discountType}
            </Descriptions.Item>
            <Descriptions.Item label="Discount Value">
              {promotionDetails.discountValue}
              {promotionDetails.discountType === "Percentage" ? "%" : " ₫"}
            </Descriptions.Item>
            <Descriptions.Item label="Quantity">
              {promotionDetails.quantity}
            </Descriptions.Item>
            <Descriptions.Item label="Used">
              {promotionDetails.usedQuantity}
            </Descriptions.Item>
            <Descriptions.Item label="Available">
              {promotionDetails.quantity - promotionDetails.usedQuantity}
            </Descriptions.Item>
            <Descriptions.Item label="Start Date">
              {promotionDetails.startDate}
            </Descriptions.Item>
            <Descriptions.Item label="End Date">
              {promotionDetails.endDate}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={promotionDetails.isActive ? "green" : "red"}>
                {promotionDetails.isActive ? "Active" : "Inactive"}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </div>
      ) : (
        <div className="text-center text-gray-500">
          No promotion details available
        </div>
      )}
    </Drawer>
  );
}

export default PromotionDetail;
