import React, { useState } from "react";
import {
  Card,
  Divider,
  Typography,
  Image,
  Button,
  TimePicker,
  InputNumber,
  Form,
  Space,
  Modal,
  Tooltip,
} from "antd";
import ShowtimeItem from "./ShowtimeItem.jsx";
import { format } from "date-fns";
import {
  VideoCameraOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import useAddShowtime from "./useAddShowtime";

const { Title, Text, Paragraph } = Typography;

const ShowtimeCard = ({ date, movie, showtimes }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  // Use the custom hook for adding showtimes
  const { mutate: addShowtime, isLoading } = useAddShowtime();

  // Format date for display
  const formatDate = (dateString) => {
    return format(new Date(dateString), "EEEE, MMMM d, yyyy");
  };

  // Check if the date has passed
  const isDatePassed = () => {
    const showDate = new Date(date);
    showDate.setHours(23, 59, 59); // End of the day
    const today = new Date();
    return showDate < today;
  };

  // Handle showtime form submission
  const handleAddShowtime = (values) => {
    addShowtime(
      {
        movieId: movie.id,
        screenId: showtimes[0].screenId, // Use the same screen as other showtimes
        date: date,
        startTime: values.startTime,
        ticketPrice: values.ticketPrice,
        movieDuration: movie.duration,
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          form.resetFields();
        },
      }
    );
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

          <Tooltip
            title={
              isDatePassed()
                ? "Cannot add showtimes for past dates"
                : "Add new showtime for this movie"
            }
          >
            <Button
              type="dashed"
              className="flex items-center justify-center h-12"
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}
              disabled={isDatePassed()}
            >
              Add Time
            </Button>
          </Tooltip>

          {/* Add Showtime Modal */}
          <Modal
            title={`Add New Showtime for ${movie.title}`}
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
          >
            <Form form={form} layout="vertical" onFinish={handleAddShowtime}>
              <Form.Item
                label="Start Time"
                name="startTime"
                rules={[
                  { required: true, message: "Please select a start time" },
                ]}
              >
                <TimePicker format="HH:mm" className="w-full" />
              </Form.Item>

              <Form.Item
                label="Ticket Price"
                name="ticketPrice"
                rules={[
                  { required: true, message: "Please enter ticket price" },
                ]}
              >
                <InputNumber
                  className="w-full"
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  addonAfter="đ"
                />
              </Form.Item>

              <Form.Item className="mb-0">
                <div className="text-gray-500 mb-4">
                  <ClockCircleOutlined className="mr-1" />
                  Movie duration: {movie.duration} minutes
                </div>
                <Space className="flex justify-end">
                  <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isLoading}
                    icon={<SaveOutlined />}
                  >
                    Add Showtime
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </Card>
  );
};

export default ShowtimeCard;
