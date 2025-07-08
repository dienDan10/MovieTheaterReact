import { Select, Space, Typography, Row, Col } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedTheaterId } from "../../../redux/screenSlice";
import { useGetTheaters } from "./useGetTheaters";

const { Option } = Select;
const { Text } = Typography;

function ScreenSelection() {
  const dispatch = useDispatch();
  const selectedTheaterId = useSelector(
    (state) => state.screen.selectedTheaterId
  );
  const { theaters, isPending } = useGetTheaters();

  const handleTheaterChange = (value) => {
    dispatch(setSelectedTheaterId(value));
  };

  return (
    <Row className="mb-4" gutter={[16, 16]} align="middle">
      <Col xs={24} sm={24} md={12} lg={12}>
        <Space size="middle" align="center">
          <Text strong style={{ display: "inline-block", minWidth: "120px" }}>
            Filter by Theater:
          </Text>
          <Select
            placeholder="Select Theater"
            style={{ width: 240 }}
            value={selectedTheaterId}
            onChange={handleTheaterChange}
            loading={isPending}
            allowClear
          >
            <Option value="">All Theaters</Option>
            {theaters.map((theater) => (
              <Option key={theater.id} value={theater.id.toString()}>
                {theater.name}
              </Option>
            ))}
          </Select>
        </Space>
      </Col>
    </Row>
  );
}

export default ScreenSelection;
