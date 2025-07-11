import { Button, Space, Table, Tag, Tooltip, Popconfirm } from "antd";
import { useDispatch } from "react-redux";
import {
  EditOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  StopOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  setSelectedConcession,
  toggleDetailsVisibility,
  toggleFormVisibility,
  setFormMode,
} from "../../../redux/concessionSlice";
import { useDisableConcession } from "./useDisableConcession";
import { useEnableConcession } from "./useEnableConcession";
import { useGetConcessions } from "./useGetConcessions";
import { useDeleteConcession } from "./useDeleteConcession";

function ConcessionTable() {
  const dispatch = useDispatch();
  const { data: concessionsData, isLoading } = useGetConcessions();
  const { mutate: disableConcession } = useDisableConcession();
  const { mutate: enableConcession } = useEnableConcession();
  const { mutate: deleteConcession } = useDeleteConcession();

  const handleViewDetails = (concession) => {
    dispatch(setSelectedConcession(concession));
    dispatch(toggleDetailsVisibility(true));
  };

  const handleEdit = (concession) => {
    dispatch(setSelectedConcession(concession));
    dispatch(setFormMode("edit"));
    dispatch(toggleFormVisibility(true));
  };

  const handleToggleStatus = (concession) => {
    if (concession.isActive) {
      disableConcession(concession.id);
    } else {
      enableConcession(concession.id);
    }
  };

  const handleDelete = (concessionId) => {
    deleteConcession(concessionId);
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imageUrl) => (
        <img
          src={imageUrl || "https://placehold.co/100x100?text=No+Image"}
          alt="Concession"
          className="h-16 w-16 object-cover rounded-md"
        />
      ),
      width: 120,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: {
        showTitle: false,
      },
      render: (description) => (
        <Tooltip placement="topLeft" title={description}>
          {description}
        </Tooltip>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => a.price - b.price,
      sortDirections: ["ascend", "descend"],
      render: (price) => new Intl.NumberFormat("vi-VN").format(price) + " ₫",
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      sorter: (a, b) => {
        if (a.isActive === b.isActive) return 0;
        return a.isActive ? -1 : 1; // Active items come first
      },
      sortDirections: ["descend", "ascend"],
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            ghost
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          />
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type={record.isActive ? "default" : "primary"}
            danger={record.isActive}
            ghost={!record.isActive}
            icon={record.isActive ? <StopOutlined /> : <CheckCircleOutlined />}
            onClick={() => handleToggleStatus(record)}
          />
          <Popconfirm
            title="Delete Concession"
            description="Are you sure you want to delete this concession?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={concessionsData?.data || []}
      rowKey="id"
      loading={isLoading}
      pagination={{ pageSize: 10 }}
      onChange={(pagination, filters, sorter) => {
        console.log("Table parameters:", { pagination, filters, sorter });
      }}
      defaultSortOrder={["isActive", "descend"]}
    />
  );
}

export default ConcessionTable;
