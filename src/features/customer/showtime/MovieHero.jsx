import { Typography, Tag, Button, Row, Col, Rate, Divider, Modal } from "antd";
import {
  PlayCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useState } from "react";

function MovieHero() {
  // State for trailer modal
  const [isTrailerVisible, setIsTrailerVisible] = useState(false);

  // Functions to handle trailer modal
  const openTrailer = () => {
    setIsTrailerVisible(true);
  };

  const closeTrailer = () => {
    setIsTrailerVisible(false);
  };

  // Fake movie data
  const movie = {
    title: "Inception",
    genre: ["Sci-Fi", "Action", "Thriller"],
    director: "Christopher Nolan",
    cast: "Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page, Tom Hardy, Ken Watanabe",
    description:
      "Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state, when the mind is at its most vulnerable.",
    duration: "148 min",
    releaseDate: "July 16, 2020",
    rating: 4.8,
    posterUrl: "/images/slider1.jpg", // Using a placeholder image from your project
    trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
  };

  return (
    <div className="relative bg-black">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${movie.posterUrl})` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/30 to-transparent"></div>

      {/* Movie Content */}
      <div className="relative container mx-auto px-6 py-20 flex flex-col md:flex-row items-center z-10 gap-10 text-white">
        {/* Movie Poster */}
        <div className="md:w-1/3 w-full flex justify-center">
          <img
            src={movie.posterUrl}
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
              defaultValue={movie.rating}
              disabled
              className="text-yellow-400"
            />
            <span className="ml-2 text-yellow-400 font-semibold text-base">
              {movie.rating}/5
            </span>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-4">
            {movie.genre.map((genre, index) => (
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
              <span>Duration: {movie.duration}</span>
            </Col>
            <Col span={24} md={12} className="flex items-center">
              <CalendarOutlined className="mr-2 text-lg" />
              <span>Release Date: {movie.releaseDate}</span>
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
          <Button
            type="primary"
            size="large"
            icon={<PlayCircleOutlined />}
            className="!bg-red-600 hover:!bg-red-700 border-none !rounded-full px-6"
            onClick={openTrailer}
          >
            Watch Trailer
          </Button>
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
        destroyOnHidden={true} // Ensures the modal is destroyed when closed
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
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export default MovieHero;
