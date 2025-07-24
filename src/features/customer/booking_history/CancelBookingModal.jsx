import React from "react";
import { Modal, Button } from "antd";
import { useDispatch } from "react-redux";
import { cancelBooking } from "../../../redux/bookingSlice";

function CancelBookingModal({ paymentId, onClose }) {
  const dispatch = useDispatch();

  const handleCancel = () => {
    dispatch(cancelBooking(paymentId));
    onClose();
  };

  return (
    <Modal open={true} onCancel={onClose} footer={null} title="Confirm Cancellation">
      <p>Are you sure you want to cancel this transaction?</p>
      <div className="flex justify-end gap-2 mt-4">
        <Button onClick={onClose}>No</Button>
        <Button danger type="primary" onClick={handleCancel}>Cancel</Button>
      </div>
    </Modal>
  );
}

export default CancelBookingModal;
