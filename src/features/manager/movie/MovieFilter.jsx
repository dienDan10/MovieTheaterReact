import { Button, Form, Input, Row, Col } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { setFilters, resetFilters } from "../../../redux/movieSlice";
import { useEffect } from "react";

function MovieFilter() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { title } = useSelector((state) => state.movie.filters);

  // Initialize form values from Redux state only once when component mounts or when filter values change
  useEffect(() => {
    form.setFieldsValue({ title });
  }, [title, form]);

  const handleFilter = (values) => {
    dispatch(
      setFilters({
        title: values.title || "",
        pageNumber: 1, // Reset to first page when filtering
      })
    );
  };

  const handleReset = () => {
    form.resetFields();
    dispatch(resetFilters());
  };

  return (
    <Form
      form={form}
      layout="horizontal"
      className="mb-4"
      initialValues={{ title }}
      onFinish={handleFilter}
    >
      <Row gutter={[16, 16]} align="bottom">
        <Col xs={24} sm={24} md={12} lg={12} xl={8}>
          <Form.Item name="title" label="Movie Title" className="mb-0!">
            <Input
              placeholder="Search by movie title"
              allowClear
              prefix={<SearchOutlined />}
            />
          </Form.Item>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={16}>
          <div className="flex flex-row gap-2">
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              Apply
            </Button>
            <Button onClick={handleReset} icon={<ReloadOutlined />}>
              Reset
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
}

export default MovieFilter;
