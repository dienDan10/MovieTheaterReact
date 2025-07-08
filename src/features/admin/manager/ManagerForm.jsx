import { Modal, Form, Input, Select, Button, Spin, InputNumber } from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useCreateManager } from "./useCreateManager";
import { useUpdateManager } from "./useUpdateManager";
import { useGetTheaters } from "./useGetTheaters";
import { useDispatch } from "react-redux";
import { notify } from "../../../redux/notificationSlice";
import {
  ERROR_NOTIFICATION,
  SUCCESS_NOTIFICATION,
} from "../../../utils/constant";

function ManagerForm({ open, onClose, manager, mode = "create" }) {
  const [form] = Form.useForm();
  const createMutation = useCreateManager();
  const updateMutation = useUpdateManager();
  const { theaters, isPending: isLoadingTheaters } = useGetTheaters();
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();

  const isEdit = mode === "edit";

  // Set initial form values when editing
  useEffect(() => {
    if (isEdit && manager) {
      form.setFieldsValue({
        username: manager.username,
        email: manager.email,
        phoneNumber: manager.phoneNumber || "",
        theaterId: manager.theater?.id || "",
      });
    } else {
      form.resetFields();
    }
  }, [form, manager, isEdit, open]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    setSubmitting(true);

    // Đảm bảo phoneNumber là string, theaterId là number
    const payload = {
      username: values.username,
      email: values.email,
      password: values.password,
      phoneNumber: String(values.phoneNumber),
      theaterId: Number(values.theaterId),
    };

    if (isEdit) {
      updateMutation.mutate(
        {
          id: manager.id,
          data: {
            username: values.username,
            email: values.email,
            phoneNumber: String(values.phoneNumber),
            theaterId: Number(values.theaterId),
          },
        },
        {
          onSuccess: () => {
            dispatch(
              notify({
                type: SUCCESS_NOTIFICATION,
                message: "Manager updated successfully",
              })
            );
            onClose(true);
          },
          onError: (error) => {
            dispatch(
              notify({
                type: ERROR_NOTIFICATION,
                message: `Failed to update manager: ${
                  error.message || "Unknown error"
                }`,
              })
            );
          },
          onSettled: () => {
            setSubmitting(false);
          },
        }
      );
    } else {
      createMutation.mutate(
        payload,
        {
          onSuccess: () => {
            dispatch(
              notify({
                type: SUCCESS_NOTIFICATION,
                message: "Manager created successfully",
              })
            );
            form.resetFields();
            onClose(true);
          },
          onError: (error) => {
            console.log(error);
            dispatch(
              notify({
                type: ERROR_NOTIFICATION,
                message: `Failed to create manager: ${
                  error.message || "Unknown error"
                }`,
              })
            );
          },
          onSettled: () => {
            setSubmitting(false);
          },
        }
      );
    }
  };

  return (
    <Modal
      title={isEdit ? "Edit Manager" : "Add New Manager"}
      open={open}
      onCancel={() => onClose(false)}
      footer={[
        <Button
          key="cancel"
          onClick={() => onClose(false)}
          disabled={submitting}
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={submitting}
          onClick={handleSubmit}
        >
          {isEdit ? "Update" : "Register"}
        </Button>,
      ]}
      maskClosable={!submitting}
      closable={!submitting}
    >
      <Form form={form} layout="vertical" disabled={submitting}>
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: "Please enter username" }]}
        >
          <Input placeholder="Enter username" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input placeholder="Enter email address" />
        </Form.Item>

        {!isEdit && (
          <>
            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please enter password" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Please confirm password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match")
                    );
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm password" />
            </Form.Item>
          </>
        )}

        <Form.Item
          name="phoneNumber"
          label="Phone Number"
          rules={[{ required: true, message: "Please enter phone number" }]}
        >
          <InputNumber
            placeholder="Enter phone number"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          name="theaterId"
          label="Assign to Theater"
          rules={[{ required: true, message: "Please select a theater" }]}
        >
          <Select placeholder="Select a theater" loading={isLoadingTheaters}>
            {theaters?.map((theater) => (
              <Select.Option key={theater.id} value={theater.id}>
                {theater.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}

ManagerForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  manager: PropTypes.object,
  mode: PropTypes.oneOf(["create", "edit"]),
};

export default ManagerForm;
