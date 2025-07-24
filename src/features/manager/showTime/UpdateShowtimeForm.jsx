import React, { useEffect } from "react";
import { Button, Form, InputNumber, TimePicker, Typography } from "antd";
import { SaveOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import useUpdateShowTime from "./useUpdateShowTime";

const { Text } = Typography;

const UpdateShowtimeForm = ({ showtime, onClose }) => {
  const [form] = Form.useForm();
  const { mutate: updateShowtime, isLoading } = useUpdateShowTime();

  // Set initial form values when showtime changes
  useEffect(() => {
    if (showtime) {
      form.setFieldsValue({
        startTime: dayjs(`2000-01-01 ${showtime.startTime}`),
        ticketPrice: showtime.ticketPrice,
        vipTicketPrice: showtime.vipTicketPrice,
      });
    }
  }, [showtime, form]);

  // Calculate end time based on start time and movie duration
  const calculateEndTime = (startTime) => {
    if (!startTime || !showtime?.movie?.duration) return null;

    const startDate = new Date(2000, 0, 1, ...startTime.split(":").map(Number));
    const endDate = new Date(
      startDate.getTime() + showtime.movie.duration * 60 * 1000
    );
    const hours = endDate.getHours().toString().padStart(2, "0");
    const minutes = endDate.getMinutes().toString().padStart(2, "0");
    const seconds = endDate.getSeconds().toString().padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };

  // Handle form submission
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const newStartTime = values.startTime.format("HH:mm:ss");
      const newEndTime = calculateEndTime(newStartTime);

      updateShowtime({
        id: showtime.id,
        startTime: newStartTime,
        endTime: newEndTime,
        ticketPrice: values.ticketPrice,
        vipTicketPrice: values.vipTicketPrice,
      });

      if (onClose) onClose();
    });
  };

  if (!showtime) return null;

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="startTime"
        label="Start Time"
        rules={[{ required: true, message: "Please select a start time" }]}
      >
        <TimePicker format="HH:mm" className="w-full" />
      </Form.Item>

      <Form.Item label="End Time">
        <Text>
          {form.getFieldValue("startTime")
            ? dayjs()
                .hour(form.getFieldValue("startTime").hour())
                .minute(
                  form.getFieldValue("startTime").minute() +
                    showtime.movie.duration
                )
                .format("HH:mm")
            : ""}
        </Text>
        <div className="text-gray-500 text-xs mt-1">
          Automatically calculated based on movie duration (
          {showtime.movie.duration} minutes)
        </div>
      </Form.Item>

      <Form.Item
        name="ticketPrice"
        label="Ticket Price"
        rules={[{ required: true, message: "Please enter ticket price" }]}
      >
        <InputNumber
          className="w-full"
          min={0}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          addonAfter="đ"
        />
      </Form.Item>

      <Form.Item
        name="vipTicketPrice"
        label="VIP Ticket Price"
        rules={[{ required: true, message: "Please enter VIP ticket price" }]}
      >
        <InputNumber
          className="w-full"
          min={0}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
          addonAfter="đ"
        />
      </Form.Item>

      <Form.Item>
        <div className="flex justify-end">
          {onClose && (
            <Button className="mr-2" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSubmit}
            loading={isLoading}
          >
            Save
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default UpdateShowtimeForm;
