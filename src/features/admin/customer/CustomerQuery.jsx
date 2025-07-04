import { Button, Col, Form, Input, Row, Space } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { setFilters, resetFilters } from "../../../redux/customerSlice";

function CustomerQuery() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.customer.filters);

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
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Form.Item name="name" label="Name">
            <Input placeholder="Search by name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={12}>
          <Form.Item name="email" label="Email">
            <Input placeholder="Search by email" />
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

export default CustomerQuery;
