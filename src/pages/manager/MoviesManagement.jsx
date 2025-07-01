import { Table, Button, Space, Input, Modal, Form } from "antd";
import { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";

// Dummy data for now
const initialMovies = [
  { key: 1, title: "Inception", genre: "Sci-Fi", year: 2010 },
  { key: 2, title: "The Dark Knight", genre: "Action", year: 2008 },
  { key: 3, title: "Interstellar", genre: "Adventure", year: 2014 },
];

function MoviesManagement() {
  const [movies, setMovies] = useState(initialMovies);
  const [searchText, setSearchText] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [form] = Form.useForm();

  // Filtered and sorted movies
  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const openAddModal = () => {
    form.resetFields();
    setIsAddModalOpen(true);
  };

  const openEditModal = (movie) => {
    setSelectedMovie(movie);
    form.setFieldsValue(movie);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (movie) => {
    setSelectedMovie(movie);
    setIsDeleteModalOpen(true);
  };

  const handleAdd = () => {
    // Placeholder for add logic
    setIsAddModalOpen(false);
  };

  const handleEdit = () => {
    // Placeholder for edit logic
    setIsEditModalOpen(false);
  };

  const handleDelete = () => {
    // Placeholder for delete logic
    setIsDeleteModalOpen(false);
  };

  const columns = [
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
      title: "Year",
      dataIndex: "year",
      key: "year",
      sorter: (a, b) => a.year - b.year,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<FaRegEdit size={28} color="#1677ff" />}
            style={{ padding: 0 }}
            onClick={() => openEditModal(record)}
          />
          <Button
            type="text"
            icon={<FaTrashAlt size={28} color="#ff4d4f" />}
            style={{ padding: 0 }}
            onClick={() => openDeleteModal(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Movies Management</h2>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
        <Button type="primary" onClick={openAddModal}>
          Add Movie
        </Button>
        <Input
          placeholder="Search movie by title..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="max-w-xs"
          allowClear
        />
      </div>
      <Table columns={columns} dataSource={filteredMovies} />

      {/* Add Movie Modal */}
      <Modal
        title="Add Movie"
        open={isAddModalOpen}
        onOk={handleAdd}
        onCancel={() => setIsAddModalOpen(false)}
        okText="Add"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="genre"
            label="Genre"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="year"
            label="Year"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Movie Modal */}
      <Modal
        title="Edit Movie"
        open={isEditModalOpen}
        onOk={handleEdit}
        onCancel={() => setIsEditModalOpen(false)}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="genre"
            label="Genre"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="year"
            label="Year"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Delete Movie Modal */}
      <Modal
        title="Delete Movie"
        open={isDeleteModalOpen}
        onOk={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        okText="Delete"
        okButtonProps={{ danger: true }}
      >
        <p>
          Are you sure you want to delete{" "}
          <b>{selectedMovie?.title}</b>?
        </p>
      </Modal>
    </div>
  );
}

export default MoviesManagement;
