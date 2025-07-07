import React from "react";
import { Tooltip } from "antd";
import PropTypes from "prop-types";
import { SpinnerSmall } from "../../../components/Spinner";
import { useDisableSeat } from "./useDisableSeat";
import { useEnableSeat } from "./useEnableSeat";

const SeatItem = ({ seat }) => {
  const { disableSeat, isPending: isDisablePending } = useDisableSeat();
  const { enableSeat, isPending: isEnablePending } = useEnableSeat();

  const isLoading = isDisablePending || isEnablePending;

  const handleToggleSeatStatus = () => {
    if (isLoading) return;

    if (seat.isActive) {
      disableSeat(seat.id);
    } else {
      enableSeat(seat.id);
    }
  };

  const getClassName = () => {
    let baseClasses =
      "flex items-center justify-center w-10 h-10 rounded-md cursor-pointer transition-all duration-200";

    if (isLoading) {
      return `${baseClasses} bg-gray-400 opacity-70`;
    }

    if (seat.isActive) {
      return `${baseClasses} bg-green-500 hover:bg-green-600`;
    }

    return `${baseClasses} bg-red-500 hover:bg-red-600`;
  };

  return (
    <Tooltip
      title={`${seat.seatRow}${seat.seatNumber} - ${
        seat.isActive ? "Enabled" : "Disabled"
      }`}
    >
      <div className={getClassName()} onClick={handleToggleSeatStatus}>
        {isLoading ? <SpinnerSmall /> : `${seat.seatRow}${seat.seatNumber}`}
      </div>
    </Tooltip>
  );
};

SeatItem.propTypes = {
  seat: PropTypes.shape({
    id: PropTypes.number.isRequired,
    seatRow: PropTypes.string.isRequired,
    seatNumber: PropTypes.number.isRequired,
    isActive: PropTypes.bool.isRequired,
    screenId: PropTypes.number.isRequired,
  }).isRequired,
};

export default SeatItem;
