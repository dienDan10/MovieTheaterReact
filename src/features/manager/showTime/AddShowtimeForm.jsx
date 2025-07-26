import React, { useState } from "react";
import {
  Button,
  Card,
  DatePicker,
  Form,
  InputNumber,
  Select,
  Table,
  TimePicker,
  Typography,
} from "antd";
import { DeleteOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  addTimeSlot,
  removeTimeSlot,
  resetNewShowtime,
  setNewShowtimeDate,
  setNewShowtimeMovieId,
  setNewShowtimeScreenId,
  setNewShowtimeTicketPrice,
  setNewShowtimeVipTicketPrice,
} from "../../../redux/manageShowtimeSlice";
import ShowTimeSelect from "./ShowTimeSelect";
import useGetScreens from "./useGetScreens";
import useGetMovies from "./useGetMovies";
import useCreateShowTimes from "./useCreateShowTimes";
import { notify } from "../../../redux/notificationSlice";
import { WARNING_NOTIFICATION } from "../../../utils/constant";

const { Title, Text } = Typography;

const AddShowtimeForm = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { data: screens = [], isLoading: isLoadingScreens } = useGetScreens();
  const { data: movies = [], isLoading: isLoadingMovies } = useGetMovies();
  const newShowtime = useSelector((state) => state.manageShowtime.newShowtime);
  const loadingStates = useSelector(
    (state) => state.manageShowtime.loadingStates
  );
  const { mutate: createShowtimes, isLoading } = useCreateShowTimes();
  const [startTime, setStartTime] = useState(null);

  // Get selected movie details
  const selectedMovie = movies?.movies.find(
    (movie) => movie.id === newShowtime.movieId
  );

  // Calculate end time based on start time and movie duration
  const calculateEndTime = (startTime) => {
    if (!startTime || !selectedMovie) return null;

    const endTime = dayjs(startTime).add(selectedMovie.duration, "minute");
    return endTime;
  };

  // Check for time conflicts with existing time slots
  const hasTimeConflict = (newStartTime, newEndTime) => {
    // Add safety margin of 10 minutes before and after
    const startWithMargin = dayjs(newStartTime).subtract(10, "minutes");
    const endWithMargin = dayjs(newEndTime).add(10, "minutes");

    return newShowtime.timeSlots.some((slot) => {
      // Convert existing slots to dayjs objects with the same date for comparison
      const existingStartTime = dayjs(`2000-01-01 ${slot.startTime}`);
      const existingEndTime = dayjs(`2000-01-01 ${slot.endTime}`);

      // Convert new times to dayjs objects with the same date
      const newStart = dayjs(`2000-01-01 ${startWithMargin.format("HH:mm")}`);
      const newEnd = dayjs(`2000-01-01 ${endWithMargin.format("HH:mm")}`);

      // Check for overlap scenarios:
      // 1. New start time is between existing start and end times
      // 2. New end time is between existing start and end times
      // 3. New time slot completely contains the existing time slot
      // 4. New time slot is completely contained within the existing time slot
      return (
        (newStart.isAfter(existingStartTime) &&
          newStart.isBefore(existingEndTime)) ||
        (newEnd.isAfter(existingStartTime) &&
          newEnd.isBefore(existingEndTime)) ||
        (newStart.isBefore(existingStartTime) &&
          newEnd.isAfter(existingEndTime)) ||
        newStart.isSame(existingStartTime) ||
        newEnd.isSame(existingEndTime)
      );
    });
  };

  // Handle add time slot
  const handleAddTimeSlot = (timeToAdd = null) => {
    const timeToUse = startTime || timeToAdd;
    if (!timeToUse || !selectedMovie) return;

    const endTime = calculateEndTime(timeToUse);
    const formattedStartTime = timeToUse.format("HH:mm");
    const formattedEndTime = endTime.format("HH:mm");

    // Check for time conflicts with existing slots
    if (hasTimeConflict(timeToUse, endTime)) {
      // Show error notification
      dispatch(
        notify({
          type: WARNING_NOTIFICATION,
          message:
            "This time slot overlaps with an existing showtime (including 10-minute safety margin). Please choose a different time.",
        })
      );
      return;
    }

    dispatch(
      addTimeSlot({
        startTime: formattedStartTime,
        endTime: formattedEndTime,
      })
    );

    setStartTime(null);
  };

  // Handle time selection from ShowTimeSelect
  const handleTimeSelect = (selectedTime) => {
    handleAddTimeSlot(selectedTime);
  };

  // Handle form values change
  const handleValuesChange = (changedValues) => {
    if ("movieId" in changedValues) {
      dispatch(setNewShowtimeMovieId(changedValues.movieId));
    }

    if ("screenId" in changedValues) {
      dispatch(setNewShowtimeScreenId(changedValues.screenId));
    }

    if ("date" in changedValues) {
      dispatch(
        setNewShowtimeDate(
          changedValues.date ? changedValues.date.format("YYYY-MM-DD") : null
        )
      );
    }

    if ("ticketPrice" in changedValues) {
      dispatch(setNewShowtimeTicketPrice(changedValues.ticketPrice));
    }

    if ("vipTicketPrice" in changedValues) {
      dispatch(setNewShowtimeVipTicketPrice(changedValues.vipTicketPrice));
    }
  };

  // Handle submit
  const handleSubmit = () => {
    form.validateFields().then(() => {
      if (newShowtime.timeSlots.length === 0) {
        return;
      }

      createShowtimes();
      form.resetFields(["startTime"]);
      setStartTime(null);
    });
  };

  // Reset form
  const handleReset = () => {
    form.resetFields();
    dispatch(resetNewShowtime());
    setStartTime(null);
  };

  // Time slots table columns
  const columns = [
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
    },
    {
      title: "Action",
      key: "action",
      render: (_, __, index) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => dispatch(removeTimeSlot(index))}
        />
      ),
    },
  ];

  return (
    <Card className="mb-6">
      <Title level={4}>Add New Showtimes</Title>
      <Form form={form} layout="vertical" onValuesChange={handleValuesChange}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Movie */}
          <Form.Item
            label="Movie"
            name="movieId"
            rules={[{ required: true, message: "Please select a movie" }]}
          >
            <Select
              placeholder="Select movie"
              loading={isLoadingMovies}
              options={movies?.movies.map((movie) => ({
                label: movie.title,
                value: movie.id,
              }))}
            />
          </Form.Item>

          {/* Screen */}
          <Form.Item
            label="Screen"
            name="screenId"
            rules={[{ required: true, message: "Please select a screen" }]}
          >
            <Select
              placeholder="Select screen"
              loading={isLoadingScreens}
              options={screens.map((screen) => ({
                label: screen.name,
                value: screen.id,
              }))}
            />
          </Form.Item>

          {/* Date */}
          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <DatePicker
              className="w-full"
              disabledDate={(current) => {
                return current && current < dayjs().startOf("day");
              }}
            />
          </Form.Item>

          {/* Ticket Price */}
          <Form.Item
            label="Ticket Price"
            name="ticketPrice"
            rules={[
              { required: true, message: "Please enter the ticket price" },
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

          {/* VIP Ticket Price */}
          <Form.Item
            label="VIP Ticket Price"
            name="vipTicketPrice"
            rules={[
              { required: true, message: "Please enter the VIP ticket price" },
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

          {/* Start Time */}
          <Form.Item label="Start Time" name="startTime">
            <div className="flex items-center">
              <TimePicker
                className="flex-grow"
                format="HH:mm"
                value={startTime}
                onChange={setStartTime}
                disabled={!selectedMovie}
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className="ml-2"
                htmlType="button"
                onClick={handleAddTimeSlot}
                disabled={!startTime || !selectedMovie}
              >
                Add
              </Button>
            </div>
          </Form.Item>
        </div>

        {selectedMovie && (
          <div className="mb-4">
            <Text className="text-gray-500">
              Movie Duration: {selectedMovie.duration} minutes
            </Text>
          </div>
        )}

        {/* Show Time Select component */}
        {selectedMovie && (
          <ShowTimeSelect
            onSelectTime={handleTimeSelect}
            selectedMovie={selectedMovie}
          />
        )}

        {/* Time slots table */}
        {newShowtime.timeSlots.length > 0 && (
          <div className="mb-4">
            <Title level={5}>Added Time Slots</Title>
            <Table
              columns={columns}
              dataSource={newShowtime.timeSlots.map((slot, index) => ({
                ...slot,
                key: index,
              }))}
              pagination={false}
              size="small"
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end mt-4">
          <Button onClick={handleReset} className="mr-2">
            Reset
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSubmit}
            loading={isLoading || loadingStates.create}
            disabled={
              !newShowtime.movieId ||
              !newShowtime.screenId ||
              !newShowtime.date ||
              !newShowtime.ticketPrice ||
              !newShowtime.vipTicketPrice ||
              newShowtime.timeSlots.length === 0
            }
          >
            Create Showtimes
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default AddShowtimeForm;
