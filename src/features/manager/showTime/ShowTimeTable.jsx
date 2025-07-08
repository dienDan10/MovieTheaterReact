import { Table, Button } from "antd";
import useGetShowTimes from "./useGetShowTimes";
import PropTypes from "prop-types";

function ShowTimeTable({ onEdit, onDetail }) {
  const { data, isLoading } = useGetShowTimes();

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Movie", dataIndex: "movieTitle", key: "movieTitle" },
    { title: "Theater", dataIndex: "theaterName", key: "theaterName" },
    { title: "Start Time", dataIndex: "startTime", key: "startTime" },
    { title: "End Time", dataIndex: "endTime", key: "endTime" },
    { title: "Price", dataIndex: "price", key: "price" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button size="small" onClick={() => onDetail(record.id)} style={{ marginRight: 8 }}>
            Detail
          </Button>
          <Button size="small" onClick={() => onEdit(record.id)}>
            Edit
          </Button>
        </>
      ),
    },
  ];

  const dataSource = Array.isArray(data) ? data : [];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={dataSource}
      loading={isLoading}
      pagination={{ pageSize: 10 }}
    />
  );
}

ShowTimeTable.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onDetail: PropTypes.func.isRequired,
};

export default ShowTimeTable;
