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
  setSelectedPromotion,
  toggleDetailsVisibility,
  toggleFormVisibility,
  setFormMode,
} from "../../../redux/promotionSlice";
import { useDisablePromotion } from "./useDisablePromotion";
import { useEnablePromotion } from "./useEnablePromotion";
import { useGetPromotions } from "./useGetPromotions";
import { useDeletePromotion } from "./useDeletePromotion";

function PromotionTable() {
  const dispatch = useDispatch();
  const { data: promotionsData, isLoading } = useGetPromotions();
  const { mutate: disablePromotion } = useDisablePromotion();
  const { mutate: enablePromotion } = useEnablePromotion();
  const { mutate: deletePromotion } = useDeletePromotion();

  const handleViewDetails = (promotion) => {
    dispatch(setSelectedPromotion(promotion));
    dispatch(toggleDetailsVisibility(true));
  };

  const handleEdit = (promotion) => {
    dispatch(setSelectedPromotion(promotion));
    dispatch(setFormMode("edit"));
    dispatch(toggleFormVisibility(true));
  };

  const handleToggleStatus = (promotion) => {
    if (promotion.isActive) {
      disablePromotion(promotion.id);
    } else {
      enablePromotion(promotion.id);
    }
  };

  const handleDelete = (promotionId) => {
    deletePromotion(promotionId);
  };

  const columns = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      sorter: (a, b) => a.description.localeCompare(b.description),
      sortDirections: ["ascend", "descend"],
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
      title: "Discount Type",
      dataIndex: "discountType",
      key: "discountType",
      sorter: (a, b) => a.discountType.localeCompare(b.discountType),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Discount Value",
      dataIndex: "discountValue",
      key: "discountValue",
      sorter: (a, b) => a.discountValue - b.discountValue,
      sortDirections: ["ascend", "descend"],
      render: (discountValue, record) => (
        <span>
          {discountValue}
          {record.discountType === "Percentage" ? "%" : " ₫"}
        </span>
      ),
    },
    {
      title: "Available",
      key: "available",
      sorter: (a, b) =>
        a.quantity - a.usedQuantity - (b.quantity - b.usedQuantity),
      sortDirections: ["ascend", "descend"],
      render: (_, record) => (
        <span>
          {record.quantity - record.usedQuantity} / {record.quantity}
        </span>
      ),
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      sorter: (a, b) => new Date(a.endDate) - new Date(b.endDate),
      sortDirections: ["ascend", "descend"],
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
            title="Delete Promotion"
            description="Are you sure you want to delete this promotion?"
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
      dataSource={promotionsData?.data || []}
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

export default PromotionTable;
