import { useState } from "react";
import { Table, Button, Space, Input, Popconfirm, message } from "antd";
import { SearchOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMovies, deleteMovie as apiDeleteMovie } from "../../../services/apiMovie";

function MovieTable({ onViewDetails, onEditMovie }) {
  // Fetch movies
  const { data, isLoading } = useQuery({
    queryKey: ["movies"],
    queryFn: async () => {
      const res = await getMovies();
      return res.data;
    },
  });

  // Mutations
  const queryClient = useQueryClient();
  const deleteMovie = useMutation({
    mutationFn: async (id) => {
      await apiDeleteMovie(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["movies"]);
      message.success("Movie deleted successfully");
    },
    onError: (error) => {
      message.error(`Failed to delete movie: ${error.message || "Unknown error"}`);
    },
  });
  const [deletingId, setDeletingId] = useState(null);

  const [searchText, setSearchText] = useState("");

  // Defensive: ensure data is an array
  const movieArray = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);

  const filteredMovies = movieArray.filter((movie) =>
    movie.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleView = (movie) => {
    if (onViewDetails) onViewDetails(movie);
  };

  const handleEdit = (movie) => {
    if (onEditMovie) onEditMovie(movie);
  };

  const handleDelete = (id) => {
    setDeletingId(id);
    return new Promise((resolve, reject) => {
      deleteMovie.mutate(id, {
        onSuccess: () => {
          resolve();
          setDeletingId(null);
        },
        onError: (error) => {
          reject(error);
          setDeletingId(null);
        },
      });
    });
  };

  const columns = [
    {
      title: "Poster",
      dataIndex: "poster",
      key: "poster",
      width: 90,
      render: (poster) =>
        poster ? (
          <img src={poster} alt="Poster" style={{ width: 60, height: 90, objectFit: "cover", borderRadius: 4 }} />
        ) : (
          <div style={{ width: 60, height: 90, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, color: '#999', fontSize: 12 }}>
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
      filters: [
        { text: "Sci-Fi", value: "Sci-Fi" },
        { text: "Action", value: "Action" },
        { text: "Adventure", value: "Adventure" },
      ],
      onFilter: (value, record) => record.genre === value,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (desc) => desc ? desc : <span style={{ color: '#aaa' }}>No description</span>,
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
            title="Delete Movie"
            description="Are you sure you want to delete this movie?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true, loading: deletingId === record.id }}
          >
            <Button
              icon={<DeleteOutlined />}
              type="link"
              danger
              loading={deletingId === record.id}
              disabled={deletingId !== null}
              title="Delete movie"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
        <Input
          placeholder="Search movie by title..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="max-w-xs"
          allowClear
        />
      </div>
      <Table
        columns={columns}
        dataSource={filteredMovies}
        loading={isLoading}
        rowKey="id"
        pagination={{
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} movies`,
        }}
      />
    </div>
  );
}

MovieTable.propTypes = {
  onViewDetails: PropTypes.func.isRequired,
  onEditMovie: PropTypes.func.isRequired,
};

export default MovieTable;
