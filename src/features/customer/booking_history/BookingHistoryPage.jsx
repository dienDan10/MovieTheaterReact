import React from "react";
import { Typography, Empty, Spin } from "antd";
import BookingHistoryFilter from "./BookingHistoryFilter";
import BookingHistoryTable from "./BookingHistoryTable";
import { useBookingHistory } from "./useBookingHistory";
import { useDispatch } from "react-redux";
import { resetBookingHistoryFilter } from "../../../redux/bookingSlice";

const { Title } = Typography;


function BookingHistoryPage() {
  const dispatch = useDispatch();
  const { data: bookings = [], isLoading, error } = useBookingHistory();

  const handleResetFilter = () => {
    dispatch(resetBookingHistoryFilter());
  };

  const isEmpty = !bookings || bookings.length === 0;

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen">
      <Title level={3}>Lịch sử đặt vé</Title>
      <BookingHistoryFilter
        onReset={handleResetFilter}
      />
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spin size="large" />
        </div>
      ) : error ? (
        <div className="p-6 text-center">
          <Title level={4} type="danger">
            Không thể tải lịch sử đặt vé. Vui lòng thử lại sau.
          </Title>
        </div>
      ) : isEmpty ? (
        <Empty description="Không có lịch sử đặt vé cho bộ lọc này" className="my-12" />
      ) : (
        <BookingHistoryTable data={bookings} loading={isLoading} error={error} />
      )}
    </div>
  );
}

export default BookingHistoryPage;
