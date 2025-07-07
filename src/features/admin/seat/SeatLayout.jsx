import React from "react";
import { Card } from "antd";
import SeatSelection from "./SeatSelection";
import SeatGrid from "./SeatGrid";
import SeatOperation from "./SeatOperation";
import { useSelector } from "react-redux";
import { ROLE_ADMIN } from "../../../utils/constant";

const SeatLayout = () => {
  const { selectedScreenId } = useSelector((state) => state.seat);
  const { user } = useSelector((state) => state.user);

  const isAdmin = user?.role === ROLE_ADMIN;

  return (
    <Card title="Seat Management" className="w-full">
      <div className="flex flex-col gap-6">
        <SeatSelection />

        {selectedScreenId && (
          <>
            <SeatGrid />
            {isAdmin && <SeatOperation />}
          </>
        )}
      </div>
    </Card>
  );
};

export default SeatLayout;
