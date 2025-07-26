import { Modal, Button, Space, Typography, Divider } from "antd";
import { CheckCircleOutlined, StopOutlined } from "@ant-design/icons";
import { useDisableSeat } from "./useDisableSeat";
import { useEnableSeat } from "./useEnableSeat";
import { useSetVip } from "./useSetVip";
import { useSetNormal } from "./useSetNormal";
import { SEAT_TYPE_VIP } from "../../../utils/constant";

function SeatItemModal({ seat, isOpen, onClose }) {
  const { disableSeat, isPending: isDisablePending } = useDisableSeat();
  const { enableSeat, isPending: isEnablePending } = useEnableSeat();
  const { setVip, isPending: isSetVipPending } = useSetVip();
  const { setNormal, isPending: isSetNormalPending } = useSetNormal();

  const isLoading =
    isDisablePending ||
    isEnablePending ||
    isSetVipPending ||
    isSetNormalPending;

  const handleToggleSeatStatus = () => {
    if (isLoading) return;

    if (seat.isActive) {
      disableSeat(seat.id, {
        onSuccess: () => {
          onClose();
        },
      });
    } else {
      enableSeat(seat.id, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const handleToggleSeatType = () => {
    if (isLoading) return;

    if (seat.seatType === SEAT_TYPE_VIP) {
      setNormal(seat.id, {
        onSuccess: () => {
          onClose();
        },
      });
    } else {
      setVip(seat.id, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  if (!seat) return null;

  const { Title, Text } = Typography;

  return (
    <Modal
      title={`Seat ${seat?.seatRow}${seat?.seatNumber} Options`}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
    >
      <div className="py-4">
        <div className="flex flex-col items-center mb-4">
          <Title level={4} className="mb-0">
            Seat Information
          </Title>
          <Text type="secondary">
            Row {seat?.seatRow}, Number {seat?.seatNumber}
          </Text>
          <div className="mt-2">
            <Text
              className={`px-3 py-1 rounded-full ${
                seat?.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {seat?.isActive ? "Enabled" : "Disabled"}
            </Text>
            <Text
              className={`ml-2 px-3 py-1 rounded-full ${
                seat?.seatType === SEAT_TYPE_VIP
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {seat?.seatType === SEAT_TYPE_VIP ? "VIP" : "Normal"}
            </Text>
          </div>
        </div>

        <Divider />

        <Space direction="vertical" className="w-full">
          <Button
            type="primary"
            danger={seat?.isActive}
            icon={<StopOutlined />}
            onClick={handleToggleSeatStatus}
            loading={isDisablePending || isEnablePending}
            block
          >
            {seat?.isActive ? "Disable Seat" : "Enable Seat"}
          </Button>

          <Button
            type="default"
            icon={<CheckCircleOutlined />}
            onClick={handleToggleSeatType}
            loading={isSetVipPending || isSetNormalPending}
            className={
              seat?.seatType === SEAT_TYPE_VIP
                ? ""
                : "bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
            }
            block
          >
            {seat?.seatType === SEAT_TYPE_VIP ? "Set to Normal" : "Set to VIP"}
          </Button>
        </Space>
      </div>
    </Modal>
  );
}

export default SeatItemModal;
