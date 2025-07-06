import { Drawer, Typography, Descriptions, Button, Spin, Space } from "antd";
import PropTypes from "prop-types";
import { EditOutlined } from "@ant-design/icons";
import { useGetTheaterById } from "./useGetTheaterById";

const { Title } = Typography;

function TheaterDetail({ open, onClose, theaterId, onEdit }) {
  const { theater, isPending } = useGetTheaterById(theaterId);

  return (
    <Drawer
      title="Theater Details"
      width={600}
      open={open}
      onClose={onClose}
      extra={
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEdit(theaterId)}
          >
            Edit
          </Button>
        </Space>
      }
    >
      <Spin spinning={isPending}>
        {isPending ? (
          <div style={{ textAlign: "center", padding: "50px 0" }}>
            Loading theater details...
          </div>
        ) : theater ? (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Name">{theater.name}</Descriptions.Item>
            <Descriptions.Item label="Address">
              {theater.address}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">{theater.phone}</Descriptions.Item>
            <Descriptions.Item label="Email">{theater.email}</Descriptions.Item>
            <Descriptions.Item label="Province">
              {theater.province?.name || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              {theater.description || "N/A"}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <div style={{ textAlign: "center", padding: "50px 0" }}>
            Theater not found
          </div>
        )}
      </Spin>
    </Drawer>
  );
}

TheaterDetail.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  theaterId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onEdit: PropTypes.func.isRequired,
};

export default TheaterDetail;
