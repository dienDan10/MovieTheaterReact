import { Button, Popconfirm, Space, Table, message, Tag } from "antd";
import {
  EditOutlined,
  EyeOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";
import { useState } from "react";
import { useGetTheaters } from "./useGetTheaters";
import { useLockUnlockTheater } from "./useLockUnlockTheater";

function TheaterTable({ onViewDetails, onEditTheater }) {
  const { theaters, isPending } = useGetTheaters();
  const lockUnlockMutation = useLockUnlockTheater();
  const [processingId, setProcessingId] = useState(null);

  const handleView = (theater) => {
    if (onViewDetails) {
      onViewDetails(theater);
    }
  };

  const handleEdit = (theater) => {
    if (onEditTheater) {
      onEditTheater(theater);
    }
  };

  const handleLockUnlock = (id) => {
    setProcessingId(id);
    return new Promise((resolve, reject) => {
      lockUnlockMutation.mutate(id, {
        onSuccess: (data) => {
          const actionType = data?.data?.isActive ? "unlocked" : "locked";
          message.success(`Theater ${actionType} successfully`);
          resolve();
          setProcessingId(null);
        },
        onError: (error) => {
          message.error(
            `Failed to update theater status: ${
              error.message || "Unknown error"
            }`
          );
          reject(error);
          setProcessingId(null);
        },
      });
    });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: true,
    },
    {
      title: "Province",
      dataIndex: "province",
      key: "province",
      render: (_, record) => record.province?.name || "N/A",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "status",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Active" : "Locked"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            type="link"
            onClick={() => handleView(record)}
            title="View details"
          />
          <Button
            icon={<EditOutlined />}
            type="link"
            onClick={() => handleEdit(record)}
            title="Edit theater"
          />
          {record.isActive ? (
            <Popconfirm
              title="Lock Theater"
              description="Are you sure you want to lock this theater?"
              onConfirm={() => handleLockUnlock(record.id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{
                danger: true,
                loading: processingId === record.id,
              }}
            >
              <Button
                icon={<LockOutlined />}
                type="link"
                danger
                loading={processingId === record.id}
                disabled={processingId !== null}
                title="Lock theater"
              />
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Unlock Theater"
              description="Are you sure you want to unlock this theater?"
              onConfirm={() => handleLockUnlock(record.id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{
                loading: processingId === record.id,
              }}
            >
              <Button
                icon={<UnlockOutlined />}
                type="link"
                loading={processingId === record.id}
                disabled={processingId !== null}
                title="Unlock theater"
              />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={theaters || []}
      rowKey="id"
      loading={isPending}
      pagination={{
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} theaters`,
      }}
    />
  );
}

TheaterTable.propTypes = {
  onViewDetails: PropTypes.func.isRequired,
  onEditTheater: PropTypes.func.isRequired,
};

export default TheaterTable;
