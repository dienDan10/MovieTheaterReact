import { Modal, Form, Input, Select, Button, message } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleFormVisibility } from "../../../redux/employeeSlice";
import { useGetTheaters } from "./useGetTheaters";
import { useCreateEmployee } from "./useCreateEmployee";
import { useUpdateEmployee } from "./useUpdateEmployee";

function EmployeeForm() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { isFormVisible, formMode, selectedEmployee } = useSelector(
    (state) => state.employee
  );
  const { theaters, isPending: isLoadingTheaters } = useGetTheaters();
  const createMutation = useCreateEmployee();
  const updateMutation = useUpdateEmployee();
  const [messageApi, contextHolder] = message.useMessage();

  const isCreating = formMode === "create";
  const title = isCreating ? "Add Employee" : "Edit Employee";
  const submitButtonText = isCreating ? "Create" : "Update";
  const isPending = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (selectedEmployee && !isCreating) {
      form.setFieldsValue({
        username: selectedEmployee.username,
        email: selectedEmployee.email,
        phoneNumber: selectedEmployee.phoneNumber,
        theaterId: selectedEmployee.theater?.id.toString(),
      });
    } else {
      form.resetFields();
    }
  }, [selectedEmployee, isCreating, form]);

  const handleCancel = () => {
    dispatch(toggleFormVisibility(false));
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    try {
      if (isCreating) {
        await createMutation.mutateAsync(values);
        messageApi.success("Employee created successfully");
      } else {
        await updateMutation.mutateAsync({
          id: selectedEmployee.id,
          ...values,
        });
        messageApi.success("Employee updated successfully");
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
          disabled={isPending}
        >
          <Form.Item
            name="username"
            label="Name"
            rules={[{ required: true, message: "Please enter the name" }]}
          >
            <Input placeholder="Enter name" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter the email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>

          {isCreating && (
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please enter a password" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>
          )}

          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[
              { required: true, message: "Please enter the phone number" },
            ]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item
            name="theaterId"
            label="Theater"
            rules={[{ required: true, message: "Please select a theater" }]}
          >
            <Select
              placeholder="Select theater"
              loading={isLoadingTheaters}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={
                theaters?.map((theater) => ({
                  value: theater.id.toString(),
                  label: theater.name,
                })) || []
              }
            />
          </Form.Item>

          <div style={{ textAlign: "right", marginTop: "16px" }}>
            <Button
              type="default"
              onClick={handleCancel}
              style={{ marginRight: 8 }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={isPending}>
              {submitButtonText}
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
}

export default EmployeeForm;
