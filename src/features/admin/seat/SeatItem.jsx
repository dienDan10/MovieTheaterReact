import { useState } from "react";
import { Tooltip } from "antd";
import { SpinnerSmall } from "../../../components/Spinner";
import { SEAT_TYPE_VIP } from "../../../utils/constant";
import SeatItemModal from "./SeatItemModal";

const SeatItem = ({ seat }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getClassName = () => {
    let baseClasses =
      "flex items-center justify-center w-10 h-10 rounded-md cursor-pointer transition-all duration-200";

    if (!seat.isActive) {
      return `${baseClasses} bg-red-500 hover:bg-red-600`;
    }

    if (seat.seatType === SEAT_TYPE_VIP) {
      return `${baseClasses} bg-yellow-500 hover:bg-yellow-600`;
    }

    return `${baseClasses} bg-green-500 hover:bg-green-600`;
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Tooltip
        title={`${seat.seatRow}${seat.seatNumber} - ${
          seat.isActive
            ? seat.seatType === SEAT_TYPE_VIP
              ? "VIP"
              : "Normal"
            : "Disabled"
        }`}
      >
        <div className={getClassName()} onClick={handleOpenModal}>
          {`${seat.seatRow}${seat.seatNumber}`}
        </div>
      </Tooltip>

      <SeatItemModal
        seat={seat}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
};
export default SeatItem;
