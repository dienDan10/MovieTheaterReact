import React from "react";
import { Button } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";

const TimeItem = ({ time, onSelect }) => {
  return (
    <Button
      type="default"
      className="m-1 flex items-center"
      onClick={() => onSelect(time)}
      icon={<ClockCircleOutlined />}
    >
      {time}
    </Button>
  );
};

export default TimeItem;
