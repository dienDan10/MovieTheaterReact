import { useState } from "react";
import { Table, Button, Space, Input, Popconfirm, message, Tag } from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  StopOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../../../redux/movieSlice";
import { useGetMovies } from "./useGetMovies";
import { useEnableMovie } from "./useEnableMovie";
import { useDisableMovie } from "./useDisableMovie";

function MovieTable({ onViewDetails, onEditMovie }) {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.movie);
  const { pageNumber, pageSize } = filters;

  // Fetch movies using custom hook
  const { movies, totalCount, isPending: isLoading } = useGetMovies();

  // Mutations for enable/disable
  const enableMovie = useEnableMovie();
  const disableMovie = useDisableMovie();
  const [processingId, setProcessingId] = useState(null);

  const handleView = (movie) => {
    if (onViewDetails) onViewDetails(movie);
  };

  const handleEdit = (movie) => {
    if (onEditMovie) onEditMovie(movie);
  };

  const handleToggleStatus = (movie) => {
    setProcessingId(movie.id);

    const toggleAction = movie.isActive ? disableMovie : enableMovie;

    toggleAction.mutate(movie.id, {
      onSuccess: () => {
        message.success(
          `Movie ${movie.isActive ? "disabled" : "enabled"} successfully`
        );
        setProcessingId(null);
      },
      onError: (error) => {
        message.error(
          `Failed to ${movie.isActive ? "disable" : "enable"} movie: ${
            error.message || "Unknown error"
          }`
        );
        setProcessingId(null);
      },
    });
  };

  const handleTableChange = (pagination) => {
    dispatch(
      setFilters({
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
      })
    );
  };

  const columns = [
    {
      title: "Poster",
      dataIndex: "posterUrl",
      key: "poster",
      width: 90,
      render: (posterUrl) =>
        posterUrl ? (
          <img
            src={posterUrl}
            alt="Poster"
            style={{
              width: 60,
              height: 90,
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
        ) : (
          <div
            style={{
              width: 60,
              height: 90,
              background: "#eee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 4,
              color: "#999",
              fontSize: 12,
            }}
          >
            No poster
          </div>
        ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Genre",
      dataIndex: "genre",
      key: "genre",
    },
    {
      title: "Director",
      dataIndex: "director",
      key: "director",
      ellipsis: true,
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (duration) => `${duration} mins`,
      sorter: (a, b) => a.duration - b.duration,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "status",
      width: 100,
      filters: [
        { text: "Active", value: true },
        { text: "Inactive", value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
      render: (isActive) =>
        isActive ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 180,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            type="link"
            onClick={() => handleView(record)}
            title="View details"
          />
          <Button
            icon={<EditOutlined />}
            type="link"
            onClick={() => handleEdit(record)}
            title="Edit movie"
          />
          <Popconfirm
            title={record.isActive ? "Disable Movie" : "Enable Movie"}
            description={`Are you sure you want to ${
              record.isActive ? "disable" : "enable"
            } this movie?`}
            onConfirm={() => handleToggleStatus(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              icon={
                record.isActive ? <StopOutlined /> : <CheckCircleOutlined />
              }
              type="link"
              danger={record.isActive}
              loading={processingId === record.id}
              disabled={processingId !== null}
              title={record.isActive ? "Disable movie" : "Enable movie"}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={movies}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current: pageNumber,
          pageSize: pageSize,
          total: totalCount,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} movies`,
        }}
        onChange={handleTableChange}
      />
    </div>
  );
}

MovieTable.propTypes = {
  onViewDetails: PropTypes.func.isRequired,
  onEditMovie: PropTypes.func.isRequired,
};

export default MovieTable;
