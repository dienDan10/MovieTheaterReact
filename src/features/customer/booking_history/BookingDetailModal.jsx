
import React, { useEffect } from "react";
import { Modal, Spin, Descriptions, Tag } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookingDetail, clearBookingDetail } from "../../../redux/bookingSlice";

function BookingDetailModal({ paymentId, onClose }) {
  const dispatch = useDispatch();
  const { bookingDetail, loadingDetail } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(fetchBookingDetail(paymentId));
    return () => {
      dispatch(clearBookingDetail());
    };
  }, [dispatch, paymentId]);

  return (
    <Modal open={true} onCancel={onClose} footer={null} title="Payment Details">
      {loadingDetail ? <Spin /> : bookingDetail ? (
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="Payment ID">{bookingDetail.payment?.id}</Descriptions.Item>
          <Descriptions.Item label="Customer Name">{bookingDetail.payment?.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{bookingDetail.payment?.email}</Descriptions.Item>
          <Descriptions.Item label="Phone Number">{bookingDetail.payment?.phoneNumber}</Descriptions.Item>
          <Descriptions.Item label="Payment Method">{bookingDetail.payment?.paymentMethod}</Descriptions.Item>
          <Descriptions.Item label="Payment Date">{bookingDetail.payment?.paymentDate && new Date(bookingDetail.payment.paymentDate).toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="Payment Status">
            <Tag color={bookingDetail.payment?.paymentStatus === "Success" ? "green" : "red"}>{bookingDetail.payment?.paymentStatus}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Total Amount">{bookingDetail.payment?.amount?.toLocaleString()} VND</Descriptions.Item>
          <Descriptions.Item label="Movie Title">{bookingDetail.movie?.title}</Descriptions.Item>
          <Descriptions.Item label="Genre">{bookingDetail.movie?.genre}</Descriptions.Item>
          <Descriptions.Item label="Director">{bookingDetail.movie?.director}</Descriptions.Item>
          <Descriptions.Item label="Cast">{bookingDetail.movie?.cast}</Descriptions.Item>
          <Descriptions.Item label="Duration">{bookingDetail.movie?.duration} phút</Descriptions.Item>
          <Descriptions.Item label="Show Date">{bookingDetail.showTime?.date && new Date(bookingDetail.showTime.date).toLocaleDateString()}</Descriptions.Item>
          <Descriptions.Item label="Show Time">{bookingDetail.showTime?.startTime} - {bookingDetail.showTime?.endTime}</Descriptions.Item>
          <Descriptions.Item label="Theater">{bookingDetail.theater?.name}</Descriptions.Item>
          <Descriptions.Item label="Screen">{bookingDetail.screen?.name}</Descriptions.Item>
          <Descriptions.Item label="Seats">
            {bookingDetail.seats?.map(seat => `${seat.seatRow}${seat.seatNumber}`).join(", ")}
          </Descriptions.Item>
          <Descriptions.Item label="Combo/Concessions">
            {bookingDetail.concessions?.length > 0 ? bookingDetail.concessions.map(c => `${c.name} x${c.quantity}`).join(", ") : "N/A"}
          </Descriptions.Item>
        </Descriptions>
      ) : <div>No data available.</div>}
    </Modal>
  );
}

export default BookingDetailModal;
