import { Drawer, Descriptions, Image, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleDetailsVisibility,
  clearSelectedConcession,
} from "../../../redux/concessionSlice";
import { useGetConcessionById } from "./useGetConcessionById";

function ConcessionDetail() {
  const dispatch = useDispatch();
  const { detailsVisible, selectedConcession } = useSelector(
    (state) => state.concession
  );

  const { data: concessionData, isLoading } = useGetConcessionById(
    selectedConcession?.id,
    detailsVisible
  );

  const handleClose = () => {
    dispatch(toggleDetailsVisibility(false));
    dispatch(clearSelectedConcession());
  };

  const concessionDetails = concessionData?.data || selectedConcession;

  return (
    <Drawer
      title="Concession Details"
      placement="right"
      onClose={handleClose}
      open={detailsVisible}
      width={500}
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : concessionDetails ? (
        <div className="space-y-6">
          <div className="flex justify-center mb-6">
            <Image
              src={
                concessionDetails.imageUrl ||
                "https://placehold.co/300x300?text=No+Image"
              }
              alt={concessionDetails.name}
              width={300}
              className="rounded-lg object-cover"
              fallback="https://placehold.co/300x300?text=Image+Error"
            />
          </div>

          <Descriptions bordered column={1}>
            <Descriptions.Item label="Name">
              {concessionDetails.name}
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              {concessionDetails.description}
            </Descriptions.Item>
            <Descriptions.Item label="Price">
              {new Intl.NumberFormat("vi-VN").format(concessionDetails.price)} ₫
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={concessionDetails.isActive ? "green" : "red"}>
                {concessionDetails.isActive ? "Active" : "Inactive"}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </div>
      ) : (
        <div className="text-center text-gray-500">
          No concession details available
        </div>
      )}
    </Drawer>
  );
}

export default ConcessionDetail;
