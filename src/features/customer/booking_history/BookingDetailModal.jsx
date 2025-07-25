

import React from "react";
import { Modal, Spin, Descriptions, Tag } from "antd";
import { useBookingDetail } from "./useBookingDetail";

function BookingDetailModal({ paymentId, onClose }) {
  const { data: bookingDetail, isLoading } = useBookingDetail(paymentId);

  return (
    <Modal open={true} onCancel={onClose} footer={null} title="Chi tiết giao dịch">
      {isLoading ? <Spin /> : bookingDetail ? (
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="Mã thanh toán">{bookingDetail.payment?.id}</Descriptions.Item>
          <Descriptions.Item label="Tên khách hàng">{bookingDetail.payment?.name}</Descriptions.Item>
          <Descriptions.Item label="Email">{bookingDetail.payment?.email}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">{bookingDetail.payment?.phoneNumber}</Descriptions.Item>
          <Descriptions.Item label="Phương thức thanh toán">{bookingDetail.payment?.paymentMethod}</Descriptions.Item>
          <Descriptions.Item label="Ngày thanh toán">{bookingDetail.payment?.paymentDate && new Date(bookingDetail.payment.paymentDate).toLocaleString()}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái thanh toán">
            <Tag color={bookingDetail.payment?.paymentStatus === "Success" ? "green" : "red"}>{bookingDetail.payment?.paymentStatus}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Tổng tiền">{bookingDetail.payment?.amount?.toLocaleString()} VND</Descriptions.Item>
          <Descriptions.Item label="Tên phim">{bookingDetail.movie?.title}</Descriptions.Item>
          <Descriptions.Item label="Thể loại">{bookingDetail.movie?.genre}</Descriptions.Item>
          <Descriptions.Item label="Đạo diễn">{bookingDetail.movie?.director}</Descriptions.Item>
          <Descriptions.Item label="Diễn viên">{bookingDetail.movie?.cast}</Descriptions.Item>
          <Descriptions.Item label="Thời lượng">{bookingDetail.movie?.duration} phút</Descriptions.Item>
          <Descriptions.Item label="Ngày chiếu">{bookingDetail.showTime?.date && new Date(bookingDetail.showTime.date).toLocaleDateString()}</Descriptions.Item>
          <Descriptions.Item label="Giờ chiếu">{bookingDetail.showTime?.startTime} - {bookingDetail.showTime?.endTime}</Descriptions.Item>
          <Descriptions.Item label="Rạp">{bookingDetail.theater?.name}</Descriptions.Item>
          <Descriptions.Item label="Phòng chiếu">{bookingDetail.screen?.name}</Descriptions.Item>
          <Descriptions.Item label="Ghế">
            {bookingDetail.seats?.map(seat => `${seat.seatRow}${seat.seatNumber}`).join(", ")}
          </Descriptions.Item>
          <Descriptions.Item label="Combo/Đồ ăn nhẹ">
            {bookingDetail.concessions?.length > 0 ? bookingDetail.concessions.map(c => `${c.name} x${c.quantity}`).join(", ") : "Không có"}
          </Descriptions.Item>
        </Descriptions>
      ) : <div>Không có dữ liệu.</div>}
    </Modal>
  );
}

export default BookingDetailModal;
