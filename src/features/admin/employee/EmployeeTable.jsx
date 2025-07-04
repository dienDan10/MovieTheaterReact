import { Table, Button, Space, Tag, Popconfirm, Tooltip, message } from "antd";
import { EditOutlined, LockOutlined, UnlockOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useGetEmployees } from "./useGetEmployees";
import { useLockEmployee } from "./useLockEmployee";
import { useUnlockEmployee } from "./useUnlockEmployee";
import {
  setPage,
  setPageSize,
  setSorting,
  setSelectedEmployee,
  setFormMode,
  toggleFormVisibility,
} from "../../../redux/employeeSlice";

function EmployeeTable() {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.employee.filters);
  const { employees, totalCount, isPending } = useGetEmployees();
  const lockMutation = useLockEmployee();
  const unlockMutation = useUnlockEmployee();
  const [messageApi, contextHolder] = message.useMessage();

  const handleLock = async (id) => {
    try {
      await lockMutation.mutateAsync(id);
      messageApi.success("Employee locked successfully");
    } catch {
      messageApi.error("Failed to lock employee");
    }
  };

  const handleUnlock = async (id) => {
    try {
      await unlockMutation.mutateAsync(id);
      messageApi.success("Employee unlocked successfully");
    } catch {
      messageApi.error("Failed to unlock employee");
    }
  };

  const handleEdit = (employee) => {
    dispatch(setSelectedEmployee(employee));
    dispatch(setFormMode("edit"));
    dispatch(toggleFormVisibility(true));
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
      dataIndex: "username",
      key: "username",
      sorter: true,
      sortOrder:
        filters.sortBy === "username"
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
    },
    {
      title: "Theater",
      dataIndex: ["theater", "name"],
      key: "theater",
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
          <Tooltip title="Edit">
            <Button
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>

          {record.isLocked ? (
            <Tooltip title="Unlock">
              <Popconfirm
                title="Unlock Employee"
                description="Are you sure you want to unlock this employee?"
                onConfirm={() => handleUnlock(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="default"
                  size="small"
                  icon={<UnlockOutlined />}
                  loading={unlockMutation.isPending}
                />
              </Popconfirm>
            </Tooltip>
          ) : (
            <Tooltip title="Lock">
              <Popconfirm
                title="Lock Employee"
                description="Are you sure you want to lock this employee?"
                onConfirm={() => handleLock(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  danger
                  size="small"
                  icon={<LockOutlined />}
                  loading={lockMutation.isPending}
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
        dataSource={employees || []}
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

export default EmployeeTable;
