import { Button, Popconfirm, Space, Table } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useState } from "react";
import { useGetProvinces } from "./useGetProvinces";
import { useDeleteProvince } from "./useDeleteProvince";

function ProvinceTable({ onEditProvince }) {
  const { provinces, isPending } = useGetProvinces();
  const deleteMutation = useDeleteProvince();

  const handleEdit = (record) => {
    if (onEditProvince) {
      onEditProvince(record);
    }
  };

  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = (id) => {
    setDeletingId(id);
    return new Promise((resolve, reject) => {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          resolve();
          setDeletingId(null);
        },
        onError: (error) => {
          reject(error);
          setDeletingId(null);
        },
      });
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            type="link"
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Province"
            description="Are you sure you want to delete this province?"
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
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const dataSource = provinces?.map((province) => ({
    key: province.id,
    ...province,
  }));

  return (
    <Table
      columns={columns}
      dataSource={dataSource || []}
      rowKey="id"
      loading={isPending}
      pagination={{
        showSizeChanger: true,
        showTotal: (total) => `Total ${total} provinces`,
      }}
    />
  );
}

ProvinceTable.propTypes = {
  onEditProvince: PropTypes.func,
};

export default ProvinceTable;
