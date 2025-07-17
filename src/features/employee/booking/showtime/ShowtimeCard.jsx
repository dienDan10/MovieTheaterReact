import { Card, Divider, Image, Typography } from "antd";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  VideoCameraOutlined,
  ClockCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import ShowtimeItem from "./ShowtimeItem";

const { Title, Text, Paragraph } = Typography;

function ShowtimeCard({ date, movie, showtimes }) {
  // Format date for display
  const formatDate = (dateString) => {
    return format(new Date(dateString), "EEEE, dd/MM/yyyy", {
      locale: vi,
    });
  };

  return (
    <Card className="mb-6 overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Movie Poster */}
        <div className="md:w-1/4 lg:w-1/5 mb-4 md:mb-0">
          <Image
            src={
              movie.posterUrl || "https://placehold.co/300x450?text=No+Poster"
            }
            alt={movie.title}
            className="rounded-md object-cover"
            fallback="https://placehold.co/300x450?text=No+Poster"
          />
        </div>

        {/* Movie Details */}
        <div className="md:w-3/4 lg:w-4/5 md:pl-6">
          <div className="flex justify-between items-center mb-2">
            <Title level={3} className="mb-0">
              {movie.title}
            </Title>
            <Text className="text-blue-600 font-semibold">
              {formatDate(date)}
            </Text>
          </div>

          <div className="flex flex-wrap mb-4">
            <Text className="mr-4 flex items-center">
              <ClockCircleOutlined className="mr-1" />
              {movie.duration} minutes
            </Text>
            <Text className="mr-4 flex items-center">
              <VideoCameraOutlined className="mr-1" />
              {movie.genre}
            </Text>
            <Text className="flex items-center">
              <TeamOutlined className="mr-1" />
              Director: {movie.director}
            </Text>
          </div>

          <Paragraph
            ellipsis={{ rows: 2, expandable: true, symbol: "more" }}
            className="mb-4"
          >
            {movie.description}
          </Paragraph>

          <Text type="secondary" className="block mb-2">
            Cast: {movie.cast}
          </Text>

          <Divider orientation="left">Showtimes</Divider>

          <div className="flex flex-wrap gap-2 mt-5 mb-5">
            {showtimes.map((showtime) => (
              <ShowtimeItem key={showtime.id} showtime={showtime} />
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ShowtimeCard;
