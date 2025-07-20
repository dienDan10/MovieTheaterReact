import { Button, DatePicker, Form, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { useGetRevenue } from "./useGetRevenue";
import dayjs from "dayjs";
import { useEffect } from "react";
import {
  resetFilters,
  setFilterEndDate,
  setFilterStartDate,
} from "../../../redux/revenueSlice";

function RevenueFilter() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.revenue);
  const { isFetching, refetch } = useGetRevenue();

  // Set initial values
  useEffect(() => {
    form.setFieldsValue({
      dateRange: [dayjs(filters.startDate), dayjs(filters.endDate)],
    });
  }, [form, filters]);

  // Handle form submission
  const onFinish = (values) => {
    const [startDate, endDate] = values.dateRange || [null, null];
    if (startDate) {
      dispatch(setFilterStartDate(startDate.format("YYYY-MM-DD")));
    }
    if (endDate) {
      dispatch(setFilterEndDate(endDate.format("YYYY-MM-DD")));
    }
    refetch();
  };

  // Handle reset
  const handleReset = () => {
    form.resetFields();
    dispatch(resetFilters());
    refetch();
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md mb-6">
      <Form
        form={form}
        name="revenueFilter"
        layout="vertical"
        onFinish={onFinish}
        className="md:flex md:flex-wrap md:items-end md:gap-4"
      >
        {/* Date Range */}
        <Form.Item
          label="Date Range"
          name="dateRange"
          className="md:flex-1 mb-2 md:mb-0"
        >
          <DatePicker.RangePicker
            className="w-full"
            format="YYYY-MM-DD"
            allowClear={false}
          />
        </Form.Item>

        {/* Buttons */}
        <Form.Item className="md:ml-auto mb-0">
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SearchOutlined />}
              loading={isFetching}
            >
              Apply
            </Button>
            <Button
              type="default"
              icon={<ReloadOutlined />}
              onClick={handleReset}
            >
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
}

export default RevenueFilter;
