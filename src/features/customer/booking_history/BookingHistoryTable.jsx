import React, { useState } from "react";
import { Table, Button, Tag } from "antd";
import BookingDetailModal from "./BookingDetailModal";
import CancelBookingModal from "./CancelBookingModal";
import {
  PAYMENT_STATUS_CANCELLED,
  PAYMENT_STATUS_FAILED,
  PAYMENT_STATUS_PENDING,
  PAYMENT_STATUS_SUCCESS,
} from "../../../utils/constant";

function BookingHistoryTable({ data, loading }) {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  const columns = [
    {
      title: "Mã thanh toán",
      dataIndex: "paymentId",
      key: "paymentId",
      align: "center",
      width: 120,
      render: (id) => <b>{id}</b>,
    },
    {
      title: "Trạng thái",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      align: "center",
      width: 120,
      render: (status) => {
        // <span
        //   style={{
        //     color: status === PAYMENT_STATUS_SUCCESS ? "#52c41a" : "#f5222d",
        //     fontWeight: 600,
        //   }}
        // >
        //   {status === PAYMENT_STATUS_SUCCESS ? "Thành công" : "Thất bại"}
        // </span>
        return (
          <>
            {status === PAYMENT_STATUS_SUCCESS && (
              <Tag color="green">Thành công</Tag>
            )}
            {status === PAYMENT_STATUS_CANCELLED && (
              <Tag color="red">Đã huỷ</Tag>
            )}
            {(status === PAYMENT_STATUS_FAILED ||
              status === PAYMENT_STATUS_PENDING) && (
              <Tag color="orange">Thất bại</Tag>
            )}
          </>
        );
      },
    },
    {
      title: "Ngày thanh toán",
      dataIndex: "paymentDate",
      key: "paymentDate",
      align: "center",
      width: 140,
      render: (date) => (date ? new Date(date).toLocaleDateString() : ""),
    },
    {
      title: "Tên phim",
      dataIndex: "movieName",
      key: "movieName",
      align: "center",
      width: 180,
      render: (name) => <span style={{ fontWeight: 500 }}>{name}</span>,
    },
    {
      title: "Ngày chiếu",
      dataIndex: "showDate",
      key: "showDate",
      align: "center",
      width: 140,
      render: (date) => (date ? new Date(date).toLocaleDateString() : ""),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      align: "center",
      width: 140,
      render: (amount) => (amount ? amount.toLocaleString() + " VND" : ""),
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center",
      width: 160,
      render: (_, record) => (
        <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              setSelectedBooking(record);
              setShowDetail(true);
            }}
          >
            Chi tiết
          </Button>
          {record.paymentStatus === PAYMENT_STATUS_SUCCESS && (
            <Button
              danger
              size="small"
              onClick={() => {
                setSelectedBooking(record);
                setShowCancel(true);
              }}
            >
              Huỷ
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 16,
        boxShadow: "0 2px 8px #00000014",
      }}
    >
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        rowKey="paymentId"
        pagination={{ pageSize: 8 }}
        bordered
        size="middle"
        scroll={{ x: "max-content" }}
        locale={{ emptyText: "Không có giao dịch nào." }}
      />
      {showDetail && (
        <BookingDetailModal
          paymentId={selectedBooking.paymentId}
          onClose={() => setShowDetail(false)}
        />
      )}
      {showCancel && (
        <CancelBookingModal
          paymentId={selectedBooking.paymentId}
          onClose={() => setShowCancel(false)}
        />
      )}
    </div>
  );
}

export default BookingHistoryTable;
