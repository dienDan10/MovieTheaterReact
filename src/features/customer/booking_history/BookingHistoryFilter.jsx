import React, { useEffect } from "react";
import { Button, DatePicker, Form, Space } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { resetBookingHistoryFilter, setBookingHistoryFilter } from "../../../redux/bookingSlice";
import { format } from "date-fns";


export default function BookingHistoryFilter({ onReset }) {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.booking.bookingHistoryFilter);
  // Sync form with redux filter (convert string to dayjs)
  useEffect(() => {
    form.setFieldsValue({
      dateRange: [
        dayjs(filter.fromDate),
        dayjs(filter.toDate),
      ],
    });
    // eslint-disable-next-line
  }, [filter.fromDate, filter.toDate]);

  const handleFinish = (values) => {
    let [start, end] = values.dateRange || [null, null];
    dispatch(
        setBookingHistoryFilter(
            {
                fromDate:start.format("YYYY-MM-DD"),
                toDate:end.format("YYYY-MM-DD"),
            }
        )
    );
    
  };

  const handleReset = () => {
    // Reset về giá trị mặc định, không để undefined/null
    dispatch(
      resetBookingHistoryFilter()
    );
    form.setFieldsValue({
      dateRange: [dayjs(format(new Date(), "yyyy-MM-dd")), dayjs(format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"))],
    });
    if (onReset) onReset();
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md mb-6">
      <Form
        form={form}
        name="bookingHistoryFilter"
        layout="vertical"
        onFinish={handleFinish}
        className="md:flex md:flex-wrap md:items-end md:gap-4"
      >
        <Form.Item
          label="Khoảng ngày"
          name="dateRange"
          className="md:flex-1 mb-2 md:mb-0"
        >
          <DatePicker.RangePicker
            className="w-full"
            format="DD/MM/YYYY"
            allowClear={false}
          />
        </Form.Item>
        <Form.Item className="md:ml-auto mb-0">
          <Space>
            <Button
              type="default"
              icon={<ReloadOutlined />}
              onClick={handleReset}
            >
              Đặt lại
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SearchOutlined />}
            >
              Lọc
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}
