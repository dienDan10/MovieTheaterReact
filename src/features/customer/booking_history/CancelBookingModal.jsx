import React from "react";
import { Modal, Button } from "antd";
import { useCancelBooking } from "./useCancelBooking";
import { useDispatch } from "react-redux";
import { notify } from "../../../redux/notificationSlice";
import {
  ERROR_NOTIFICATION,
  SUCCESS_NOTIFICATION,
} from "../../../utils/constant";

function CancelBookingModal({ paymentId, onClose }) {
  const { mutate, isLoading } = useCancelBooking();
  const dispatch = useDispatch();

  const handleCancel = () => {
    mutate(paymentId, {
      onSuccess: () => {
        onClose();
        dispatch(
          notify({
            type: SUCCESS_NOTIFICATION,
            message: "Huỷ vé thành công!",
          })
        );
      },
      onError: (error) => {
        dispatch(
          notify({
            type: ERROR_NOTIFICATION,
            message:
              error?.response?.data?.message ||
              "Huỷ vé thất bại. Vui lòng thử lại sau.",
          })
        );
        onClose();
      },
    });
  };

  return (
    <Modal
      open={true}
      onCancel={onClose}
      footer={null}
      title="Xác nhận huỷ giao dịch"
    >
      <p>Bạn có chắc chắn muốn huỷ giao dịch này?</p>
      <div style={{ fontSize: 13, color: "#888", marginBottom: 12 }}>
        <div>
          - Chỉ có thể hoàn vé <b>3 lần/tháng</b>.
        </div>
        <div>
          - Phải hoàn vé <b>trước ít nhất 2 tiếng</b> so với giờ chiếu của vé
          đó.
        </div>
        <div>
          - Điểm trả về sẽ bị <b>khấu trừ 20%</b> trên tổng tiền giao dịch.
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button onClick={onClose}>Không</Button>
        <Button
          danger
          type="primary"
          loading={isLoading}
          onClick={handleCancel}
        >
          Huỷ
        </Button>
      </div>
    </Modal>
  );
}

export default CancelBookingModal;
