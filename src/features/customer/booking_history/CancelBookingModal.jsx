import React from "react";
import { Modal, Button } from "antd";
import { useCancelBooking } from "./useCancelBooking";


function CancelBookingModal({ paymentId, onClose }) {
  const { mutate, isLoading } = useCancelBooking();

  const handleCancel = () => {
    mutate(paymentId, { onSuccess: onClose });
  };

  return (
    <Modal open={true} onCancel={onClose} footer={null} title="Xác nhận huỷ giao dịch">
      <p>Bạn có chắc chắn muốn huỷ giao dịch này?</p>
      <div className="flex justify-end gap-2 mt-4">
        <Button onClick={onClose}>Không</Button>
        <Button danger type="primary" loading={isLoading} onClick={handleCancel}>Huỷ</Button>
      </div>
    </Modal>
  );
}

export default CancelBookingModal;
