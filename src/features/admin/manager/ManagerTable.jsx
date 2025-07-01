import { Table, Button, Tag, Popconfirm, Tooltip, Space } from "antd";
import {
  LockOutlined,
  UnlockOutlined,
  UserAddOutlined,
  EditOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";
import { useState } from "react";
import { useGetManagers } from "./useGetManagers";
import { useLockManager } from "./useLockManager";
import { useUnlockManager } from "./useUnlockManager";
import { useDispatch } from "react-redux";
import { notify } from "../../../redux/notificationSlice";
import {
  ERROR_NOTIFICATION,
  SUCCESS_NOTIFICATION,
} from "../../../utils/constant";

function ManagerTable({ onAddManager, onEditManager }) {
  const { managers, isPending } = useGetManagers();
  const lockMutation = useLockManager();
  const unlockMutation = useUnlockManager();
  const [actioningId, setActioningId] = useState(null);
  const dispatch = useDispatch();

  const handleEdit = (manager) => {
    if (onEditManager) {
      onEditManager(manager);
    }
  };

  const handleLockUnlock = (manager) => {
    const isLocked = manager.isLocked;
    const managerId = manager.id;

    setActioningId(managerId);

    const mutation = isLocked ? unlockMutation : lockMutation;
    const actionText = isLocked ? "unlock" : "lock";

    return new Promise((resolve, reject) => {
      mutation.mutate(managerId, {
        onSuccess: () => {
          dispatch(
            notify({
              type: SUCCESS_NOTIFICATION,
              message: `Manager ${actionText}ed successfully`,
            })
          );
          resolve();
          setActioningId(null);
        },
        onError: (error) => {
          dispatch(
            notify({
              type: ERROR_NOTIFICATION,
              message: `Failed to ${actionText} manager: ${
                error.message || "Unknown error"
              }`,
            })
          );
          reject(error);
          setActioningId(null);
        },
      });
    });
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "userName",
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text) => text || "N/A",
    },
    {
      title: "Theater",
      key: "theater",
      render: (_, record) => record.theater?.name || "N/A",
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
      width: 150,
      render: (_, record) => {
        const isLocked = record.isLocked;
        return (
          <Space>
            <Tooltip title="Edit manager">
              <Button
                icon={<EditOutlined />}
                type="link"
                onClick={() => handleEdit(record)}
              />
            </Tooltip>

            <Popconfirm
              title={`${isLocked ? "Unlock" : "Lock"} Manager`}
              description={`Are you sure you want to ${
                isLocked ? "unlock" : "lock"
              } this manager?`}
              onConfirm={() => handleLockUnlock(record)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{
                loading: actioningId === record.id,
              }}
            >
              <Tooltip title={isLocked ? "Unlock manager" : "Lock manager"}>
                <Button
                  icon={isLocked ? <UnlockOutlined /> : <LockOutlined />}
                  type={isLocked ? "primary" : "default"}
                  danger={!isLocked}
                  loading={actioningId === record.id}
                  disabled={actioningId !== null}
                />
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 16,
        }}
      >
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={onAddManager}
        >
          Add Manager
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={managers || []}
        rowKey="id"
        loading={isPending}
        pagination={{
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} managers`,
        }}
      />
    </>
  );
}

ManagerTable.propTypes = {
  onAddManager: PropTypes.func.isRequired,
  onEditManager: PropTypes.func.isRequired,
};

export default ManagerTable;
