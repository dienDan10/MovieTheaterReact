import { Modal, Form, Input, InputNumber, Select, Button, message } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFormVisibility } from "../../../redux/screenSlice";
import { useCreateScreen } from "./useCreateScreen";
import { useUpdateScreen } from "./useUpdateScreen";
import { useGetTheaters } from "./useGetTheaters";

function ScreenForm() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { isFormVisible, formMode, selectedScreen } = useSelector(
    (state) => state.screen
  );
  const selectedTheaterId = useSelector(
    (state) => state.screen.selectedTheaterId
  );

  const { theaters, isPending: isLoadingTheaters } = useGetTheaters();
  const createMutation = useCreateScreen();
  const updateMutation = useUpdateScreen();
  const [messageApi, contextHolder] = message.useMessage();

  const isCreating = formMode === "create";
  const title = isCreating ? "Add Screen" : "Edit Screen Name";

  useEffect(() => {
    if (selectedScreen && !isCreating) {
      form.setFieldValue("name", selectedScreen.name);
    } else if (isCreating) {
      form.resetFields();
      // Set the selected theater if one is selected in the filter
      if (selectedTheaterId) {
        form.setFieldValue("theaterId", selectedTheaterId);
      }
    }
  }, [selectedScreen, isCreating, form, selectedTheaterId]);

  const handleCancel = () => {
    dispatch(toggleFormVisibility(false));
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      if (isCreating) {
        await createMutation.mutateAsync(values);
        messageApi.success("Screen created successfully");
      } else {
        await updateMutation.mutateAsync({
          id: selectedScreen.id,
          name: values.name,
        });
        messageApi.success("Screen updated successfully");
      }
      dispatch(toggleFormVisibility(false));
      form.resetFields();
    } catch (error) {
      messageApi.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={title}
        open={isFormVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          disabled={createMutation.isPending || updateMutation.isPending}
        >
          <Form.Item
            name="name"
            label="Screen Name"
            rules={[{ required: true, message: "Please enter screen name" }]}
          >
            <Input placeholder="Enter screen name" />
          </Form.Item>

          {isCreating && (
            <>
              <Form.Item
                name="theaterId"
                label="Theater"
                rules={[{ required: true, message: "Please select a theater" }]}
              >
                <Select
                  placeholder="Select theater"
                  loading={isLoadingTheaters}
                  options={theaters.map((theater) => ({
                    value: theater.id,
                    label: theater.name,
                  }))}
                />
              </Form.Item>

              <Form.Item
                name="rows"
                label="Number of Rows"
                rules={[
                  { required: true, message: "Please enter number of rows" },
                ]}
              >
                <InputNumber min={1} max={20} style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                name="columns"
                label="Number of Columns"
                rules={[
                  { required: true, message: "Please enter number of columns" },
                ]}
              >
                <InputNumber min={1} max={20} style={{ width: "100%" }} />
              </Form.Item>
            </>
          )}

          <div style={{ textAlign: "right", marginTop: "16px" }}>
            <Button
              type="default"
              onClick={handleCancel}
              style={{ marginRight: 8 }}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {isCreating ? "Create" : "Update"}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}

export default ScreenForm;
