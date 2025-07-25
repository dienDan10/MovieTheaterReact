import { useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Modal,
  InputNumber,
  Select,
  DatePicker,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  toggleFormVisibility,
  clearSelectedPromotion,
} from "../../../redux/promotionSlice";
import { useCreatePromotion } from "./useCreatePromotion";
import { useUpdatePromotion } from "./useUpdatePromotion";
import {
  PROMOTION_TYPE_FIXED,
  PROMOTION_TYPE_PERCENTAGE,
} from "../../../utils/constant";

const validateMessages = {
  required: "${label} is required!",
  types: {
    number: "${label} must be a valid number!",
  },
  number: {
    min: "${label} must be at least ${min}!",
  },
};

function PromotionForm() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { formVisible, formMode, selectedPromotion } = useSelector(
    (state) => state.promotion
  );

  const { mutate: createPromotion, isPending: isCreating } =
    useCreatePromotion();
  const { mutate: updatePromotion, isPending: isUpdating } =
    useUpdatePromotion();

  const isPending = isCreating || isUpdating;
  const isEditMode = formMode === "edit";

  useEffect(() => {
    if (formVisible) {
      if (isEditMode && selectedPromotion) {
        form.setFieldsValue({
          description: selectedPromotion.description,
          discountType: selectedPromotion.discountType,
          discountValue: selectedPromotion.discountValue,
          quantity: selectedPromotion.quantity,
          startDate: selectedPromotion.startDate
            ? dayjs(selectedPromotion.startDate)
            : null,
          endDate: selectedPromotion.endDate
            ? dayjs(selectedPromotion.endDate)
            : null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [formVisible, selectedPromotion, isEditMode, form]);

  const handleCancel = () => {
    dispatch(toggleFormVisibility(false));
    dispatch(clearSelectedPromotion());
    form.resetFields();
  };

  const handleSubmit = (values) => {
    const formData = {
      ...values,
      startDate: values.startDate.format("YYYY-MM-DD"),
      endDate: values.endDate.format("YYYY-MM-DD"),
    };

    if (isEditMode && selectedPromotion) {
      updatePromotion(
        {
          id: selectedPromotion.id,
          ...formData,
        },
        {
          onSuccess: () => {
            handleCancel();
          },
        }
      );
    } else {
      createPromotion(formData, {
        onSuccess: () => {
          handleCancel();
        },
      });
    }
  };

  return (
    <Modal
      title={isEditMode ? "Edit Promotion" : "Add Promotion"}
      open={formVisible}
      onCancel={handleCancel}
      footer={null}
      width={700}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        validateMessages={validateMessages}
        className="mt-4"
      >
        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={4} placeholder="Enter promotion description" />
        </Form.Item>

        <Form.Item
          name="discountType"
          label="Discount Type"
          rules={[{ required: true }]}
        >
          <Select placeholder="Select discount type">
            <Select.Option value={PROMOTION_TYPE_PERCENTAGE}>
              Percentage
            </Select.Option>
            <Select.Option value={PROMOTION_TYPE_FIXED}>
              Fixed Amount
            </Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="discountValue"
          label="Discount Value"
          rules={[{ required: true }, { type: "number", min: 1 }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Enter discount value"
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            min={1}
          />
        </Form.Item>

        <Form.Item
          name="quantity"
          label="Quantity"
          rules={[{ required: true }, { type: "number", min: 1 }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Enter quantity"
            min={1}
          />
        </Form.Item>

        <Form.Item
          name="startDate"
          label="Start Date"
          rules={[{ required: true }]}
        >
          <DatePicker
            style={{ width: "100%" }}
            format="YYYY-MM-DD"
            disabledDate={(current) => {
              return current && current < dayjs().startOf("day");
            }}
          />
        </Form.Item>

        <Form.Item
          name="endDate"
          label="End Date"
          rules={[
            { required: true },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || !getFieldValue("startDate")) {
                  return Promise.resolve();
                }
                if (value.isBefore(getFieldValue("startDate"))) {
                  return Promise.reject(
                    new Error("End date must be after start date")
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <DatePicker
            style={{ width: "100%" }}
            format="YYYY-MM-DD"
            disabledDate={(current) => {
              const startDate = form.getFieldValue("startDate");
              return (
                current &&
                (current < dayjs().startOf("day") ||
                  (startDate && current < startDate))
              );
            }}
          />
        </Form.Item>

        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={isPending}>
            {isEditMode ? "Update" : "Create"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default PromotionForm;
