import { useState } from "react";
import { Card, Button, Typography, Space, Drawer } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import MovieTable from "./MovieTable";
import MovieDetail from "./MovieDetail";
import MovieForm from "./MovieForm";

const { Title } = Typography;

function MovieLayout() {
  // Detail drawer state
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  // Form modal state
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("create"); // "create" or "edit"
  const [editMovieId, setEditMovieId] = useState(null);


  // Handle viewing movie details
  const handleViewDetails = (movie) => {
    setSelectedMovieId(movie?.id);
    setDetailDrawerOpen(true);
  };

  // Handle creating a new movie
  const handleCreateMovie = () => {
    setFormMode("create");
    setEditMovieId(null);
    setFormModalOpen(true);
  };

  // Handle editing a movie
  const handleEditMovie = (movie) => {
    setFormMode("edit");
    setEditMovieId(movie?.id);
    setFormModalOpen(true);
  };

  // Handle edit button in detail drawer
  const handleEditFromDetails = () => {
    setDetailDrawerOpen(false);
    setFormMode("edit");
    setEditMovieId(selectedMovieId);
    setFormModalOpen(true);
  };

  // Handle form modal close
  const handleFormClose = () => {
    setFormModalOpen(false);
    setFormMode("create");
  };

  return (
    <>
      <MovieForm
        open={formModalOpen}
        onClose={handleFormClose}
        movieId={editMovieId}
        mode={formMode}
      />
      <Card>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Space direction="horizontal" justify="space-between" style={{ width: "100%" }}>
            <Title level={2}>Movies</Title>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateMovie}>
              Add Movie
            </Button>
          </Space>
          {/* Movie Table */}
          <MovieTable onViewDetails={handleViewDetails} onEditMovie={handleEditMovie} />
          {/* Movie details drawer */}
          <Drawer
            title="Movie Details"
            width={600}
            open={detailDrawerOpen}
            onClose={() => setDetailDrawerOpen(false)}
            extra={
              <Button type="primary" onClick={handleEditFromDetails}>
                Edit
              </Button>
            }
          >
            <MovieDetail open={detailDrawerOpen} onClose={() => setDetailDrawerOpen(false)} movieId={selectedMovieId} onEdit={handleEditMovie} />
          </Drawer>
        </Space>
      </Card>
    </>
  );
}

export default MovieLayout;
