import { Button, Form, Input } from "antd";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { notify } from "../../../redux/notificationSlice";
import { ERROR_NOTIFICATION } from "../../../utils/constant";

function SearchTicketForm({ onCheckin }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = (values) => {
    try {
      setLoading(true);
      const { ticketId } = values;

      // Validate ticket ID format (CineMax_Ticket_paymentId_datetime)
      if (!ticketId.startsWith("CineMax_Ticket_")) {
        dispatch(
          notify({
            type: ERROR_NOTIFICATION,
            message: "Invalid ticket ID format",
          })
        );
        setLoading(false);
        return;
      }

      // Extract payment ID from ticket ID
      const parts = ticketId.split("_");
      if (parts.length < 3) {
        dispatch(
          notify({
            type: ERROR_NOTIFICATION,
            message: "Invalid ticket ID format",
          })
        );
        setLoading(false);
        return;
      }

      const paymentId = parts[2];

      // Make sure paymentId is a number
      if (isNaN(paymentId)) {
        dispatch(
          notify({
            type: ERROR_NOTIFICATION,
            message: "Invalid payment ID",
          })
        );
        setLoading(false);
        return;
      }

      // Call the parent's onCheckin function with the extracted paymentId
      onCheckin(paymentId);
      setLoading(false);
    } catch (err) {
      dispatch(
        notify({
          type: ERROR_NOTIFICATION,
          message:
            "An error occurred while processing the ticket: " + err.message,
        })
      );
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-center mb-6">Ticket Check-in</h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          name="ticketId"
          label="Ticket ID"
          rules={[
            {
              required: true,
              message: "Please enter the ticket ID",
            },
          ]}
        >
          <Input
            placeholder="Enter CineMax_Ticket_ID"
            size="large"
            prefix={<FaSearch className="mr-2 text-gray-400" />}
          />
        </Form.Item>

        <Form.Item className="mb-0">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full h-10 bg-blue-600 hover:bg-blue-700"
            size="large"
          >
            Check In
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default SearchTicketForm;
