import { Modal, Form, Input, Select, Button, Spin } from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useGetProvinces } from "../province/useGetProvinces";
import { useCreateTheater } from "./useCreateTheater";
import { useUpdateTheater } from "./useUpdateTheater";
import { useGetTheaterById } from "./useGetTheaterById";

const { TextArea } = Input;

function TheaterForm({ open, onClose, theaterId, mode }) {
  const [form] = Form.useForm();
  const isEdit = mode === "edit";

  // Only fetch theater data if we're editing
  const { theater, isPending: isLoadingTheater } = useGetTheaterById(
    isEdit ? theaterId : null
  );

  const { provinces, isPending: isLoadingProvinces } = useGetProvinces();
  const createMutation = useCreateTheater();
  const updateMutation = useUpdateTheater();

  const [submitting, setSubmitting] = useState(false);

  // Set form fields when theater data is loaded (for edit mode)
  useEffect(() => {
    if (theater && isEdit) {
      form.setFieldsValue({
        name: theater.name,
        address: theater.address,
        phone: theater.phone,
        email: theater.email,
        description: theater.description,
        provinceId: theater.province?.id,
      });
    }
  }, [theater, form, isEdit]);

  // Reset form when modal is opened/closed
  useEffect(() => {
    if (open) {
      // If we're not editing, reset the form when opening
      if (!isEdit) {
        form.resetFields();
      }
    }
  }, [open, form, isEdit]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    setSubmitting(true);

    if (isEdit) {
      updateMutation.mutate(
        {
          id: theaterId,
          ...values,
        },
        {
          onSuccess: () => {
            onClose(true); // Close modal and indicate success
          },
          onSettled: () => {
            setSubmitting(false);
          },
        }
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          onClose(true); // Close modal and indicate success
        },
        onSettled: () => {
          setSubmitting(false);
        },
      });
    }
  };

  const isLoading = isEdit ? isLoadingTheater : false;
  const isSubmitting =
    submitting || createMutation.isPending || updateMutation.isPending;
  const modalTitle = isEdit ? "Edit Theater" : "Create Theater";

  return (
    <Modal
      title={modalTitle}
      open={open}
      onCancel={() => onClose(false)}
      footer={[
        <Button
          key="cancel"
          onClick={() => onClose(false)}
          disabled={isSubmitting}
        >
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isSubmitting}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isEdit ? "Update" : "Create"}
        </Button>,
      ]}
      maskClosable={!isSubmitting}
      closable={!isSubmitting}
    >
      <Spin spinning={isLoading}>
        <Form form={form} layout="vertical" disabled={isSubmitting}>
          <Form.Item
            name="name"
            label="Theater Name"
            rules={[{ required: true, message: "Please enter theater name" }]}
          >
            <Input placeholder="Enter theater name" />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[
              { required: true, message: "Please enter theater address" },
            ]}
          >
            <Input placeholder="Enter theater address" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input placeholder="Enter phone number" />
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

          <Form.Item
            name="provinceId"
            label="Province"
            rules={[{ required: true, message: "Please select a province" }]}
          >
            <Select
              placeholder="Select a province"
              loading={isLoadingProvinces}
              //defaultValue={theater?.provinceId}
            >
              {provinces?.map((province) => (
                <Select.Option key={province.id} value={province.id}>
                  {province.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Description">
            <TextArea
              rows={4}
              placeholder="Enter theater description (optional)"
            />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}

TheaterForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  theaterId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  mode: PropTypes.oneOf(["edit", "create"]).isRequired,
};

export default TheaterForm;
