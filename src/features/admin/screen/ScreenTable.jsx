import { Table, Button, Space, Tag, Popconfirm, Tooltip, message } from "antd";
import {
  EditOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetScreens } from "./useGetScreens";
import { useEnableScreen } from "./useEnableScreen";
import { useDisableScreen } from "./useDisableScreen";
import {
  setSelectedScreen,
  setFormMode,
  toggleFormVisibility,
} from "../../../redux/screenSlice";

function ScreenTable() {
  const dispatch = useDispatch();
  const selectedTheaterId = useSelector(
    (state) => state.screen.selectedTheaterId
  );
  const { screens, isPending } = useGetScreens(selectedTheaterId);
  const [messageApi, contextHolder] = message.useMessage();

  const enableMutation = useEnableScreen();
  const disableMutation = useDisableScreen();
  const [processingId, setProcessingId] = useState(null);

  const handleEdit = (screen) => {
    dispatch(setSelectedScreen(screen));
    dispatch(setFormMode("edit"));
    dispatch(toggleFormVisibility(true));
  };

  const handleEnableScreen = async (id) => {
    setProcessingId(id);
    try {
      await enableMutation.mutateAsync(id);
      messageApi.success("Screen enabled successfully");
    } catch {
      messageApi.error("Failed to enable screen");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDisableScreen = async (id) => {
    setProcessingId(id);
    try {
      await disableMutation.mutateAsync(id);
      messageApi.success("Screen disabled successfully");
    } catch {
      messageApi.error("Failed to disable screen");
    } finally {
      setProcessingId(null);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Theater",
      dataIndex: "theaterName",
      key: "theaterName",
    },
    {
      title: "Dimensions",
      key: "dimensions",
      render: (_, record) => (
        <span>
          {record.rows} rows × {record.columns} columns
        </span>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => (
        <Tag color={record.isActive ? "green" : "red"}>
          {record.isActive ? "Active" : "Disabled"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit Name">
            <Button
              icon={<EditOutlined />}
              type="link"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>

          {record.isActive ? (
            <Tooltip title="Disable Screen">
              <Popconfirm
                title="Disable Screen"
                description="Are you sure you want to disable this screen?"
                onConfirm={() => handleDisableScreen(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  icon={<StopOutlined />}
                  type="link"
                  danger
                  loading={
                    processingId === record.id && disableMutation.isPending
                  }
                  disabled={processingId !== null}
                />
              </Popconfirm>
            </Tooltip>
          ) : (
            <Tooltip title="Enable Screen">
              <Popconfirm
                title="Enable Screen"
                description="Are you sure you want to enable this screen?"
                onConfirm={() => handleEnableScreen(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  icon={<CheckCircleOutlined />}
                  type="link"
                  style={{ color: "green" }}
                  loading={
                    processingId === record.id && enableMutation.isPending
                  }
                  disabled={processingId !== null}
                />
              </Popconfirm>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <Table
        columns={columns}
        dataSource={screens}
        rowKey="id"
        loading={isPending}
        pagination={{
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} screens`,
        }}
      />
    </>
  );
}

export default ScreenTable;
