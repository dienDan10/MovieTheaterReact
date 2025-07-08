import { useSelector, useDispatch } from "react-redux";
import { Card, Button, Typography, Space, Drawer } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import MovieTable from "./MovieTable";
import MovieDetail from "./MovieDetail";
import MovieForm from "./MovieForm";
import MovieFilter from "./MovieFilter";
import {
  toggleDetailsVisibility,
  setSelectedMovie,
  clearSelectedMovie,
  toggleFormVisibility,
  setFormMode,
} from "../../../redux/movieSlice";

const { Title } = Typography;

function MovieLayout() {
  const dispatch = useDispatch();

  // Get state from Redux
  const { detailsVisible, selectedMovie, formVisible, formMode } = useSelector(
    (state) => state.movie
  );

  // Handle viewing movie details
  const handleViewDetails = (movie) => {
    dispatch(setSelectedMovie(movie));
    dispatch(toggleDetailsVisibility(true));
  };

  // Handle creating a new movie
  const handleCreateMovie = () => {
    dispatch(clearSelectedMovie());
    dispatch(setFormMode("create"));
    dispatch(toggleFormVisibility(true));
  };

  // Handle editing a movie
  const handleEditMovie = (movie) => {
    dispatch(setSelectedMovie(movie));
    dispatch(setFormMode("edit"));
    dispatch(toggleFormVisibility(true));
  };

  // Handle edit button in detail drawer
  const handleEditFromDetails = () => {
    dispatch(toggleDetailsVisibility(false));
    dispatch(setFormMode("edit"));
    dispatch(toggleFormVisibility(true));
  };

  // Handle form modal close
  const handleFormClose = () => {
    dispatch(toggleFormVisibility(false));
  };

  return (
    <>
      <MovieForm
        open={formVisible}
        onClose={handleFormClose}
        movieId={selectedMovie?.id}
        mode={formMode}
      />
      <Card>
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <Space
            direction="horizontal"
            justify="space-between"
            style={{ width: "100%" }}
          >
            <Title level={2}>Movies</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateMovie}
            >
              Add Movie
            </Button>
          </Space>
          {/* Movie Filter */}
          <MovieFilter />
          {/* Movie Table */}
          <MovieTable
            onViewDetails={handleViewDetails}
            onEditMovie={handleEditMovie}
          />
          {/* Movie details drawer */}
          <Drawer
            title="Movie Details"
            width={600}
            open={detailsVisible}
            onClose={() => dispatch(toggleDetailsVisibility(false))}
            extra={
              <Button type="primary" onClick={handleEditFromDetails}>
                Edit
              </Button>
            }
          >
            <MovieDetail
              movieId={selectedMovie?.id}
              open={detailsVisible}
              onClose={() => dispatch(toggleDetailsVisibility(false))}
              onEdit={handleEditMovie}
            />
          </Drawer>
        </Space>
      </Card>
    </>
  );
}

export default MovieLayout;
