import { Button, Col, Form, Input, Row, Select, Space } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { setFilters, resetFilters } from "../../../redux/employeeSlice";
import { useGetTheaters } from "./useGetTheaters";

function EmployeeQuery() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.employee.filters);
  const { theaters, isPending: isLoadingTheaters } = useGetTheaters();

  const handleSubmit = (values) => {
    dispatch(setFilters(values));
  };

  const handleReset = () => {
    form.resetFields();
    dispatch(resetFilters());
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={filters}
      className="mb-4"
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <Form.Item name="name" label="Name">
            <Input placeholder="Search by name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <Form.Item name="email" label="Email">
            <Input placeholder="Search by email" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={8} lg={8} xl={8}>
          <Form.Item name="theaterId" label="Theater">
            <Select
              placeholder="Select theater"
              loading={isLoadingTheaters}
              allowClear
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={[
                { value: "", label: "All Theaters" },
                ...(theaters?.map((theater) => ({
                  value: theater.id.toString(),
                  label: theater.name,
                })) || []),
              ]}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={24} style={{ textAlign: "right" }}>
          <Space>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              Apply
            </Button>
            <Button onClick={handleReset} icon={<ReloadOutlined />}>
              Reset
            </Button>
          </Space>
        </Col>
      </Row>
    </Form>
  );
}

export default EmployeeQuery;
