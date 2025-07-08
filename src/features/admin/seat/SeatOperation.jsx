import React from "react";
import { Card, Button, Space, Tooltip } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useAddRow } from "./useAddRow";
import { useAddColumn } from "./useAddColumn";
import { useRemoveRow } from "./useRemoveRow";
import { useRemoveColumn } from "./useRemoveColumn";

const SeatOperation = () => {
  const { selectedScreenId, seatRows, seatColumns } = useSelector(
    (state) => state.seat
  );

  const { addRow, isPending: isAddingRow } = useAddRow();
  const { addColumn, isPending: isAddingColumn } = useAddColumn();
  const { removeRow, isPending: isRemovingRow } = useRemoveRow();
  const { removeColumn, isPending: isRemovingColumn } = useRemoveColumn();

  const handleAddRow = () => {
    addRow(selectedScreenId);
  };

  const handleAddColumn = () => {
    addColumn(selectedScreenId);
  };

  const handleRemoveRow = () => {
    removeRow(selectedScreenId);
  };

  const handleRemoveColumn = () => {
    removeColumn(selectedScreenId);
  };

  const isLoading =
    isAddingRow || isAddingColumn || isRemovingRow || isRemovingColumn;
  const hasRows = seatRows && seatRows.length > 0;
  const hasColumns = seatColumns && seatColumns.length > 0;

  return (
    <Card title="Seat Operations" size="small" className="mt-4">
      <Space
        direction="horizontal"
        className="w-full flex justify-center gap-4"
      >
        <Tooltip title="Add a new row of seats">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddRow}
            loading={isAddingRow}
            disabled={isLoading}
          >
            Add Row
          </Button>
        </Tooltip>

        <Tooltip title="Add a new column of seats">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddColumn}
            loading={isAddingColumn}
            disabled={isLoading}
          >
            Add Column
          </Button>
        </Tooltip>

        <Tooltip
          title={
            !hasRows ? "No rows to remove" : "Remove the last row of seats"
          }
        >
          <Button
            danger
            icon={<MinusOutlined />}
            onClick={handleRemoveRow}
            loading={isRemovingRow}
            disabled={isLoading || !hasRows}
          >
            Remove Row
          </Button>
        </Tooltip>

        <Tooltip
          title={
            !hasColumns
              ? "No columns to remove"
              : "Remove the last column of seats"
          }
        >
          <Button
            danger
            icon={<MinusOutlined />}
            onClick={handleRemoveColumn}
            loading={isRemovingColumn}
            disabled={isLoading || !hasColumns}
          >
            Remove Column
          </Button>
        </Tooltip>
      </Space>
    </Card>
  );
};

export default SeatOperation;
