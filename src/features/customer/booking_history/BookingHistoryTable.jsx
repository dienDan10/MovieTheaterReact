import React, { useState } from "react";
import { Table, Button } from "antd";
import BookingDetailModal from "./BookingDetailModal";
import CancelBookingModal from "./CancelBookingModal";

function BookingHistoryTable({ data, loading }) {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  const columns = [
    { title: "Payment ID", dataIndex: "paymentId", key: "paymentId" },
    { title: "Status", dataIndex: "paymentStatus", key: "paymentStatus" },
    { title: "Payment Date", dataIndex: "paymentDate", key: "paymentDate" },
    { title: "Movie Name", dataIndex: "movieName", key: "movieName" },
    { title: "Show Date", dataIndex: "showDate", key: "showDate" },
    { title: "Total Amount", dataIndex: "totalAmount", key: "totalAmount" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="primary" size="small" onClick={() => { setSelectedBooking(record); setShowDetail(true); }}>Detail</Button>
          <Button danger size="small" className="ml-2" onClick={() => { setSelectedBooking(record); setShowCancel(true); }}>Cancel</Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="paymentId" />
      {showDetail && (
        <BookingDetailModal paymentId={selectedBooking.paymentId} onClose={() => setShowDetail(false)} />
      )}
      {showCancel && (
        <CancelBookingModal paymentId={selectedBooking.paymentId} onClose={() => setShowCancel(false)} />
      )}
    </>
  );
}

export default BookingHistoryTable;
