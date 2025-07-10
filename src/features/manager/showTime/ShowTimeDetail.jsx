import { useState } from "react";
import {
  Drawer,
  Typography,
  Descriptions,
  Space,
  Button,
  InputNumber,
  TimePicker,
  Popconfirm,
  Form,
  Spin,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { EditOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { clearSelectedShowtime } from "../../../redux/manageShowtimeSlice";
import useUpdateShowTime from "./useUpdateShowTime";
import useDeleteShowTime from "./useDeleteShowTime";
import useGetMovieById from "./useGetMovieById";
import useGetScreenById from "./useGetScreenById";
import { format } from "date-fns";

const { Title, Text } = Typography;

const ShowTimeDetail = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const selectedShowtime = useSelector(
    (state) => state.manageShowtime.selectedShowtime
  );
  const drawerVisible = useSelector(
    (state) => state.manageShowtime.drawerVisible
  );
  const { mutate: updateShowtime, isLoading: isUpdating } = useUpdateShowTime();
  const { mutate: deleteShowtime, isLoading: isDeleting } = useDeleteShowTime();

  // Fetch movie and screen details
  const { data: movieData, isLoading: isLoadingMovie } = useGetMovieById(
    selectedShowtime?.movieId
  );

  const { data: screenData, isLoading: isLoadingScreen } = useGetScreenById(
    selectedShowtime?.screenId
  );

  if (!selectedShowtime) {
    return null;
  }

  const { id, date, startTime, endTime, ticketPrice } = selectedShowtime;
  const movie = movieData || { title: "Loading...", duration: 0 };
  const screen = screenData || { name: "Loading..." };

  // Format date for display
  const formatDate = (dateString) => {
    return format(new Date(dateString), "EEEE, MMMM d, yyyy");
  };

  // Calculate end time based on start time and movie duration
  const calculateEndTime = (startTimeStr) => {
    if (!startTimeStr || !movie?.duration) return null;

    const [hours, minutes, seconds] = startTimeStr.split(":").map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, seconds);

    const movieDuration = movie.duration;
    const endDate = new Date(startDate.getTime() + movieDuration * 60000);
    const endHours = endDate.getHours().toString().padStart(2, "0");
    const endMinutes = endDate.getMinutes().toString().padStart(2, "0");
    const endSeconds = endDate.getSeconds().toString().padStart(2, "0");

    return `${endHours}:${endMinutes}:${endSeconds}`;
  };

  const handleClose = () => {
    dispatch(clearSelectedShowtime());
    setIsEditing(false);
  };

  const handleEdit = () => {
    form.setFieldsValue({
      startTime: dayjs(`2000-01-01 ${startTime}`),
      ticketPrice: ticketPrice,
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      const newStartTime = values.startTime.format("HH:mm:ss");
      const newEndTime = calculateEndTime(newStartTime);

      updateShowtime({
        id,
        startTime: newStartTime,
        endTime: newEndTime,
        ticketPrice: values.ticketPrice,
      });

      setIsEditing(false);
    });
  };

  const handleDelete = () => {
    deleteShowtime(id);
  };

  return (
    <Drawer
      title={<Title level={4}>Showtime Details</Title>}
      placement="right"
      width={500}
      onClose={handleClose}
      open={drawerVisible}
      extra={
        isEditing ? (
          <Space>
            <Button onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
              loading={isUpdating}
            >
              Save
            </Button>
          </Space>
        ) : (
          <Space>
            <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
              Update
            </Button>
            <Popconfirm
              title="Delete showtime"
              description="Are you sure you want to delete this showtime?"
              onConfirm={handleDelete}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ loading: isDeleting }}
            >
              <Button type="primary" danger icon={<DeleteOutlined />}>
                Remove
              </Button>
            </Popconfirm>
          </Space>
        )
      }
    >
      {isEditing ? (
        <Form form={form} layout="vertical">
          <Form.Item
            name="startTime"
            label="Start Time"
            rules={[{ required: true, message: "Please select a start time" }]}
          >
            <TimePicker format="HH:mm" className="w-full" />
          </Form.Item>

          <Form.Item label="End Time">
            {isLoadingMovie ? (
              <Spin size="small" />
            ) : (
              <>
                <Text>
                  {form.getFieldValue("startTime")
                    ? dayjs()
                        .hour(form.getFieldValue("startTime").hour())
                        .minute(
                          form.getFieldValue("startTime").minute() +
                            movie.duration
                        )
                        .format("HH:mm")
                    : ""}
                </Text>
                <div className="text-gray-500 text-xs mt-1">
                  Automatically calculated based on movie duration (
                  {movie.duration} minutes)
                </div>
              </>
            )}
          </Form.Item>

          <Form.Item
            name="ticketPrice"
            label="Ticket Price"
            rules={[{ required: true, message: "Please enter ticket price" }]}
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
        </Form>
      ) : (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Movie Title">
            {isLoadingMovie ? <Spin size="small" /> : movie?.title}
          </Descriptions.Item>
          <Descriptions.Item label="Screen">
            {isLoadingScreen ? <Spin size="small" /> : screen?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Date">{formatDate(date)}</Descriptions.Item>
          <Descriptions.Item label="Start Time">{startTime}</Descriptions.Item>
          <Descriptions.Item label="End Time">{endTime}</Descriptions.Item>
          <Descriptions.Item label="Duration">
            {isLoadingMovie ? (
              <Spin size="small" />
            ) : (
              `${movie?.duration} minutes`
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Ticket Price">
            {ticketPrice?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} đ
          </Descriptions.Item>

          {!isLoadingMovie && movie?.genre && (
            <Descriptions.Item label="Genre">{movie.genre}</Descriptions.Item>
          )}

          {!isLoadingMovie && movie?.director && (
            <Descriptions.Item label="Director">
              {movie.director}
            </Descriptions.Item>
          )}
        </Descriptions>
      )}
    </Drawer>
  );
};

export default ShowTimeDetail;
