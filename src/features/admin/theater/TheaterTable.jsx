import { Button, Popconfirm, Space, Table, message } from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useState } from "react";
import { useGetTheaters } from "./useGetTheaters";
import { useDeleteTheater } from "./useDeleteTheater";

function TheaterTable({ onViewDetails, onEditTheater }) {
  const { theaters, isPending } = useGetTheaters();
  const deleteMutation = useDeleteTheater();
  const [deletingId, setDeletingId] = useState(null);

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

  const handleDelete = (id) => {
    setDeletingId(id);
    return new Promise((resolve, reject) => {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          message.success("Theater deleted successfully");
          resolve();
          setDeletingId(null);
        },
        onError: (error) => {
          message.error(
            `Failed to delete theater: ${error.message || "Unknown error"}`
          );
          reject(error);
          setDeletingId(null);
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
      render: (_, record) => record.province || "N/A",
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
          <Popconfirm
            title="Delete Theater"
            description="Are you sure you want to delete this theater?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{
              danger: true,
              loading: deletingId === record.id,
            }}
          >
            <Button
              icon={<DeleteOutlined />}
              type="link"
              danger
              loading={deletingId === record.id}
              disabled={deletingId !== null}
              title="Delete theater"
            />
          </Popconfirm>
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
