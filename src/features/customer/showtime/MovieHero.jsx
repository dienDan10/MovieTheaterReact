import {
  Typography,
  Tag,
  Button,
  Row,
  Col,
  Rate,
  Divider,
  Modal,
  Spin,
} from "antd";
import {
  PlayCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import useGetMovieDetails from "./useGetMovieDetails";

function MovieHero() {
  // State for trailer modal
  const [isTrailerVisible, setIsTrailerVisible] = useState(false);

  // Fetch movie details
  const { data: movieData, isLoading } = useGetMovieDetails();
  const movie = movieData?.data;

  // Functions to handle trailer modal
  const openTrailer = () => {
    setIsTrailerVisible(true);
  };

  const closeTrailer = () => {
    setIsTrailerVisible(false);
  };

  // Parse the genre string into an array of genres
  const genreArray = movie?.genre
    ? movie.genre.split(",").map((g) => g.trim())
    : [];

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] bg-black">
        <Spin size="large" />
      </div>
    );
  }

  // Show placeholder if no movie data
  if (!movie) {
    return (
      <div className="flex justify-center items-center min-h-[400px] bg-black text-white">
        <p>Movie information not available</p>
      </div>
    );
  }

  return (
    <div className="relative bg-black">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: `url(${movie.posterUrl || "/background.jpg"})`,
        }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/30 to-transparent"></div>

      {/* Movie Content */}
      <div className="relative container mx-auto px-6 py-20 flex flex-col md:flex-row items-center z-10 gap-10 text-white">
        {/* Movie Poster */}
        <div className="md:w-1/3 w-full flex justify-center">
          <img
            src={movie.posterUrl || "/background.jpg"}
            alt={movie.title}
            className="rounded-2xl shadow-2xl w-full max-w-sm object-cover"
            style={{ maxHeight: "500px" }}
          />
        </div>

        {/* Movie Details */}
        <div className="md:w-2/3 w-full">
          <Typography.Title level={1} className="!text-white !mb-2">
            {movie.title}
          </Typography.Title>

          {/* Rating */}
          <div className="flex items-center mb-4">
            <Rate
              allowHalf
              defaultValue={4}
              disabled
              className="text-yellow-400"
            />
            <span className="ml-2 text-yellow-400 font-semibold text-base">
              4/5
            </span>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-4">
            {genreArray.map((genre, index) => (
              <Tag
                key={index}
                color="geekblue"
                className="!px-3 !py-1 !text-sm !rounded-full"
              >
                {genre}
              </Tag>
            ))}
          </div>

          {/* Info Row */}
          <Row gutter={[16, 16]} className="mb-6 text-gray-300">
            <Col span={24} md={12} className="flex items-center">
              <ClockCircleOutlined className="mr-2 text-lg" />
              <span>Duration: {movie.duration} min</span>
            </Col>
            <Col span={24} md={12} className="flex items-center">
              <CalendarOutlined className="mr-2 text-lg" />
              <span>
                Release Date: {new Date(movie.releaseDate).toLocaleDateString()}
              </span>
            </Col>
          </Row>

          <Divider className="border-gray-600" />

          {/* Description */}
          <div className="mb-6">
            <Typography.Paragraph className="!text-gray-200 !text-base leading-relaxed">
              {movie.description}
            </Typography.Paragraph>
          </div>

          {/* Director & Cast */}
          <div className="mb-6">
            <p className="text-gray-400 font-semibold">Director:</p>
            <p className="text-white">{movie.director}</p>
          </div>

          <div className="mb-8">
            <p className="text-gray-400 font-semibold">Cast:</p>
            <p className="text-white">{movie.cast}</p>
          </div>

          {/* Button */}
          {movie.trailerUrl && (
            <Button
              type="primary"
              size="large"
              icon={<PlayCircleOutlined />}
              className="!bg-red-600 hover:!bg-red-700 border-none !rounded-full px-6"
              onClick={openTrailer}
            >
              Watch Trailer
            </Button>
          )}
        </div>
      </div>

      {/* Trailer Modal */}
      <Modal
        title={`${movie.title} - Official Trailer`}
        open={isTrailerVisible}
        onCancel={closeTrailer}
        footer={null}
        width={800}
        centered
        destroyOnClose={true}
      >
        <div className="aspect-w-16 aspect-h-9">
          <iframe
            src={`https://www.youtube.com/embed/${getYoutubeId(
              movie.trailerUrl
            )}?autoplay=1`}
            title={`${movie.title} trailer`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-[450px]"
          ></iframe>
        </div>
      </Modal>
    </div>
  );
}

// Helper function to extract YouTube video ID
function getYoutubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export default MovieHero;
