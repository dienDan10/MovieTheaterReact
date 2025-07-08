import { Modal, Form, Input, InputNumber, DatePicker, TimePicker, Button, Spin, Select, Space } from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import useCreateShowTime from "./useCreateShowTime";
import useUpdateShowTime from "./useUpdateShowTime";
import useGetShowTimeById from "./useGetShowTimeById";
import { useGetMovies } from "../../manager/movie/useGetMovies";
import useGetScreens from "./useGetScreens";
import dayjs from "dayjs";

function ShowTimeForm({ open, onClose, showTimeId, mode, movieId }) {
  const [form] = Form.useForm();
  const isEdit = mode === "edit";
  const { data: showTime, isLoading } = useGetShowTimeById(showTimeId, isEdit && open);
  const createMutation = useCreateShowTime();
  const updateMutation = useUpdateShowTime();
  const [submitting, setSubmitting] = useState(false);

  // Lấy danh sách phim và màn hình
  const { movies = [] } = useGetMovies();
  const { data: screensData } = useGetScreens();
  const screens = Array.isArray(screensData) ? screensData : (screensData?.data || []);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [timeSlots, setTimeSlots] = useState([{ startTime: null, endTime: null }]);

  useEffect(() => {
    if (showTime && isEdit) {
      const data = showTime.data || showTime;
      form.setFieldsValue({
        movieId: data.movieId,
        screenId: data.screenId,
        date: data.date ? dayjs(data.date) : null,
        ticketPrice: data.ticketPrice,
      });
      setSelectedMovie(movies.find(m => m.id === data.movieId));
      // Set time slots
      const slots = data.showTimes?.[0] || {};
      const startTimes = slots.startTimes || [];
      const endTimes = slots.endTimes || [];
      const newTimeSlots = startTimes.map((startTime, idx) => ({
        startTime: dayjs(startTime.ticks / 10000 - 621355968000000000),
        endTime: endTimes[idx] ? dayjs(endTimes[idx].ticks / 10000 - 621355968000000000) : null,
      }));
      setTimeSlots(newTimeSlots);
    } else if (open && !isEdit && movieId && movies.length > 0) {
      // Pre-select movie if movieId is provided in create mode and movies are loaded
      form.setFieldsValue({ movieId });
      setSelectedMovie(movies.find(m => m.id === movieId));
    }
  }, [showTime, form, isEdit, movies, open, movieId]);

  useEffect(() => {
    if (open && !isEdit && !movieId) {
      form.resetFields();
      setSelectedMovie(null);
      setTimeSlots([{ startTime: null, endTime: null }]);
    }
  }, [open, form, isEdit, movieId]);

  // Khi chọn movie thì lưu lại để kiểm tra duration
  const handleMovieChange = (value) => {
    const movie = movies.find(m => m.id === value);
    setSelectedMovie(movie);
    form.setFieldsValue({ movieId: value });
  };

  // Add/remove time slot handlers
  const handleAddTimeSlot = () => {
    setTimeSlots([...timeSlots, { startTime: null, endTime: null }]);
  };
  const handleRemoveTimeSlot = (idx) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== idx));
  };
  // Update time slot value and auto-calculate endTime
  const handleTimeSlotChange = (idx, field, value) => {
    const newSlots = [...timeSlots];
    newSlots[idx][field] = value;
    // Auto-calculate endTime if startTime or movie changes
    if (field === 'startTime' && selectedMovie && selectedMovie.duration && value) {
      newSlots[idx].endTime = value.clone().add(selectedMovie.duration, 'minute');
    }
    setTimeSlots(newSlots);
  };

  // When movie changes, recalculate all endTimes
  useEffect(() => {
    if (selectedMovie && selectedMovie.duration) {
      setTimeSlots(slots => slots.map(slot => {
        if (slot.startTime) {
          return { ...slot, endTime: slot.startTime.clone().add(selectedMovie.duration, 'minute') };
        }
        return { ...slot, endTime: null };
      }));
    }
  }, [selectedMovie]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      // Validate all time slots
      for (let i = 0; i < timeSlots.length; i++) {
        const slot = timeSlots[i];
        if (!slot.startTime || !slot.endTime) {
          throw new Error("Please select start time for all slots");
        }
        if (slot.endTime.isBefore(slot.startTime)) {
          throw new Error("End time must be after start time");
        }
        if (selectedMovie && slot.endTime.diff(slot.startTime, 'minute') < selectedMovie.duration) {
          throw new Error(`Slot #${i+1}: Duration must >= movie duration (${selectedMovie.duration} minutes)`);
        }
      }
      setSubmitting(true);
      if (isEdit) {
        const submitValues = {
          movieId: Number(values.movieId),
          screenId: Number(values.screenId),
          date: values.date ? values.date.format("YYYY-MM-DD") : null,
          ticketPrice: Number(values.ticketPrice),
        };
        updateMutation.mutate(
          { id: showTimeId, ...submitValues },
          {
            onSuccess: () => onClose(true),
            onSettled: () => setSubmitting(false),
          }
        );
      } else {
        // Bulk create
        const showTimes = [
          {
            date: values.date.format("YYYY-MM-DD"),
            startTimes: timeSlots.map(slot => slot.startTime ? slot.startTime.format("HH:mm") : null),
            endTimes: timeSlots.map(slot => slot.endTime ? slot.endTime.format("HH:mm") : null),
          }
        ];
        createMutation.mutate({
          movieId: Number(values.movieId),
          screenId: Number(values.screenId),
          showTimes,
          ticketPrice: Number(values.ticketPrice),
        }, {
          onSuccess: () => onClose(true),
          onSettled: () => setSubmitting(false),
        });
      }
    } catch (err) {
      // Nếu validateFields lỗi thì không làm gì, form sẽ tự hiển thị lỗi
      if (err instanceof Error) {
        form.setFields([{ name: 'timeSlots', errors: [err.message] }]);
      }
      console.error("Validation failed:", err);
    }
  };

  const isSubmitting = submitting || createMutation.isPending || updateMutation.isPending;
  const modalTitle = isEdit ? "Edit ShowTime" : "Create ShowTime";

  return (
    <Modal
      title={modalTitle}
      open={open}
      onCancel={() => onClose(false)}
      footer={[
        <Button key="cancel" onClick={() => onClose(false)} disabled={isSubmitting}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={isSubmitting} onClick={handleSubmit} disabled={isSubmitting || (isEdit && isLoading)}>
          {isEdit ? "Update" : "Create"}
        </Button>,
      ]}
      maskClosable={!isSubmitting}
      closable={!isSubmitting}
    >
      <Spin spinning={isEdit && isLoading}>
        <Form form={form} layout="vertical" disabled={isSubmitting}>
          <Form.Item name="movieId" label="Movie" rules={[{ required: true, message: "Please select a movie" }]}> 
            <Select
              showSearch
              placeholder="Select a movie"
              optionFilterProp="children"
              onChange={handleMovieChange}
              filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
            >
              {movies.map(movie => (
                <Select.Option key={movie.id} value={movie.id}>{movie.title}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="screenId" label="Screen" rules={[{ required: true, message: "Please select a screen" }]}> 
            <Select
              showSearch
              placeholder="Select a screen"
              optionFilterProp="children"
              filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
            >
              {screens.map(screen => (
                <Select.Option key={screen.id} value={screen.id}>{screen.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="date" label="Date" rules={[{ required: true, message: "Please select date" }]}> 
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item label="Showtime Slots" required>
            {timeSlots.map((slot, idx) => (
              <Space key={idx} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <TimePicker
                  value={slot.startTime}
                  onChange={v => handleTimeSlotChange(idx, 'startTime', v)}
                  format="HH:mm"
                  placeholder="Start Time"
                  style={{ width: 100 }}
                />
                <TimePicker
                  value={slot.endTime}
                  format="HH:mm"
                  placeholder="End Time"
                  style={{ width: 100 }}
                  disabled
                />
                {timeSlots.length > 1 && (
                  <Button danger onClick={() => handleRemoveTimeSlot(idx)} size="small">Remove</Button>
                )}
              </Space>
            ))}
            <Button type="dashed" onClick={handleAddTimeSlot} block size="small">+ Add Slot</Button>
          </Form.Item>
          <Form.Item 
            name="ticketPrice" 
            label="Ticket Price" 
            rules={[ 
              { required: true, message: "Please enter ticket price" },
              { type: "number", min: 1, message: "Ticket price must be greater than 0" }
            ]}
            validateTrigger={['onChange', 'onBlur']}
          > 
            <InputNumber min={1} style={{ width: "100%" }} placeholder="Enter ticket price" /> 
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}

ShowTimeForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  showTimeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  mode: PropTypes.oneOf(["edit", "create"]).isRequired,
  movieId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ShowTimeForm;
