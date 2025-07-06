import { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Space,
  Card,
  Typography,
  Spin,
  Alert,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useCreateProvince } from "./useCreateProvince";
import { useUpdateProvince } from "./useUpdateProvince";
import ProvinceTable from "./ProvinceTable";
import AccessDenied from "../../../pages/AccessDenied";
import { useGetProvinces } from "./useGetProvinces";
import { useSelector } from "react-redux";
import { ROLE_ADMIN } from "../../../utils/constant";

const { Title } = Typography;

function ProvinceLayout() {
  const { user } = useSelector((state) => state.user);
  const { error, refetch } = useGetProvinces();
  const createMutation = useCreateProvince();
  const updateMutation = useUpdateProvince();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null); // province being edited
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editing) {
        updateMutation.mutate(
          { id: editing.id, name: values.name },
          {
            onSuccess: () => {
              setModalOpen(false);
            },
          }
        );
      } else {
        createMutation.mutate(
          { name: values.name },
          {
            onSuccess: () => {
              setModalOpen(false);
            },
          }
        );
      }
    });
  };

  if (user?.role !== ROLE_ADMIN) return <AccessDenied />;

  return (
    <Card>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Space
          direction="horizontal"
          justify="space-between"
          style={{ width: "100%" }}
        >
          <Title level={2}>Provinces</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Add Province
          </Button>
        </Space>

        {error && (
          <Alert
            message="Error"
            description={`Failed to load provinces: ${
              error.message || "Unknown error"
            }`}
            type="error"
            showIcon
            action={
              <Button size="small" type="primary" onClick={() => refetch()}>
                Retry
              </Button>
            }
          />
        )}

        <ProvinceTable onEditProvince={handleEdit} />

        <Modal
          title={editing ? "Edit Province" : "Add Province"}
          open={modalOpen}
          onOk={handleModalOk}
          onCancel={() => setModalOpen(false)}
          confirmLoading={createMutation.isPending || updateMutation.isPending}
        >
          <Spin spinning={createMutation.isPending || updateMutation.isPending}>
            <Form form={form} layout="vertical" initialValues={{ name: "" }}>
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input the province name!",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Form>
          </Spin>
        </Modal>
      </Space>
    </Card>
  );
}

export default ProvinceLayout;
