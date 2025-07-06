import { Table, Button, Space, Tag, Popconfirm, Tooltip, message } from "antd";
import { LockOutlined, UnlockOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useGetCustomers } from "./useGetCustomers";
import { useLockCustomer } from "./useLockCustomer";
import { useUnlockCustomer } from "./useUnlockCustomer";
import { setPage, setPageSize, setSorting } from "../../../redux/customerSlice";

function CustomerTable() {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.customer.filters);
  const { customers, totalCount, isPending } = useGetCustomers();
  const lockMutation = useLockCustomer();
  const unlockMutation = useUnlockCustomer();
  const [messageApi, contextHolder] = message.useMessage();

  const handleLock = async (id) => {
    try {
      await lockMutation.mutateAsync(id);
      messageApi.success("Customer locked successfully");
    } catch {
      messageApi.error("Failed to lock customer");
    }
  };

  const handleUnlock = async (id) => {
    try {
      await unlockMutation.mutateAsync(id);
      messageApi.success("Customer unlocked successfully");
    } catch {
      messageApi.error("Failed to unlock customer");
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    // Handle pagination
    if (pagination.current !== filters.pageNumber) {
      dispatch(setPage(pagination.current));
    }

    if (pagination.pageSize !== filters.pageSize) {
      dispatch(setPageSize(pagination.pageSize));
    }

    // Handle sorting
    if (sorter.field && sorter.order) {
      const isDescending = sorter.order === "descend";
      dispatch(
        setSorting({
          sortBy: sorter.field,
          isDescending,
        })
      );
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "userName", // Based on the sample data format
      key: "userName",
      sorter: true,
      sortOrder:
        filters.sortBy === "userName"
          ? filters.isDescending
            ? "descend"
            : "ascend"
          : null,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: true,
      sortOrder:
        filters.sortBy === "email"
          ? filters.isDescending
            ? "descend"
            : "ascend"
          : null,
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (phoneNumber) => phoneNumber || "N/A",
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Tag color={record.isLocked ? "red" : "green"}>
          {record.isLocked ? "Locked" : "Active"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          {record.isLocked ? (
            <Tooltip title="Unlock">
              <Popconfirm
                title="Unlock Customer"
                description="Are you sure you want to unlock this customer?"
                onConfirm={() => handleUnlock(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="default"
                  size="small"
                  icon={<UnlockOutlined />}
                  loading={
                    unlockMutation.isPending &&
                    unlockMutation.variables === record.id
                  }
                />
              </Popconfirm>
            </Tooltip>
          ) : (
            <Tooltip title="Lock">
              <Popconfirm
                title="Lock Customer"
                description="Are you sure you want to lock this customer?"
                onConfirm={() => handleLock(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  danger
                  size="small"
                  icon={<LockOutlined />}
                  loading={
                    lockMutation.isPending &&
                    lockMutation.variables === record.id
                  }
                />
              </Popconfirm>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      <Table
        rowKey="id"
        columns={columns}
        dataSource={customers || []}
        loading={isPending}
        pagination={{
          current: filters.pageNumber,
          pageSize: filters.pageSize,
          total: totalCount,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
}

export default CustomerTable;
