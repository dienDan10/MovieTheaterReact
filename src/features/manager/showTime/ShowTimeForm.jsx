import { Modal, Form, Input, InputNumber, DatePicker, TimePicker, Button, Spin, Select } from "antd";
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

  useEffect(() => {
    if (showTime && isEdit) {
      const data = showTime.data || showTime;
      form.setFieldsValue({
        movieId: data.movieId,
        screenId: data.screenId,
        date: data.date ? dayjs(data.date) : null,
        startTime: data.startTime ? dayjs(data.startTime, "HH:mm:ss") : null,
        endTime: data.endTime ? dayjs(data.endTime, "HH:mm:ss") : null,
        ticketPrice: data.ticketPrice,
      });
      setSelectedMovie(movies.find(m => m.id === data.movieId));
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
    }
  }, [open, form, isEdit, movieId]);

  // Khi chọn movie thì lưu lại để kiểm tra duration
  const handleMovieChange = (value) => {
    const movie = movies.find(m => m.id === value);
    setSelectedMovie(movie);
    form.setFieldsValue({ movieId: value });
  };

  // Auto-calculate endTime when movie or startTime changes
  const handleFormValuesChange = (changedValues, allValues) => {
    if (changedValues.startTime || changedValues.movieId) {
      const movie = movies.find(m => m.id === (allValues.movieId || (selectedMovie && selectedMovie.id)));
      const startTime = allValues.startTime;
      if (movie && startTime && movie.duration) {
        const end = startTime.clone().add(movie.duration, 'minute');
        form.setFieldsValue({ endTime: end });
        setSelectedMovie(movie); // keep selectedMovie in sync
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      // Kiểm tra duration
      if (selectedMovie) {
        const start = values.startTime;
        const end = values.endTime;
        if (start && end) {
          // Chỉ lấy phút, bỏ phần giây
          const startMinutes = start.hour() * 60 + start.minute();
          const endMinutes = end.hour() * 60 + end.minute();
          const durationMinutes = endMinutes - startMinutes;
          if (durationMinutes < selectedMovie.duration) {
            form.setFields([{
              name: 'endTime',
              errors: [`Show time duration must >= movie duration (${selectedMovie.duration} minutes)`],
            }]);
            return;
          }
        }
      }
      setSubmitting(true);
      const submitValues = {
        movieId: Number(values.movieId),
        screenId: Number(values.screenId),
        date: values.date ? values.date.format("YYYY-MM-DD") : null,
        startTime: values.startTime ? values.startTime.format("HH:mm:ss") : null,
        endTime: values.endTime ? values.endTime.format("HH:mm:ss") : null,
        ticketPrice: Number(values.ticketPrice),
      };
      if (isEdit) {
        updateMutation.mutate(
          { id: showTimeId, ...submitValues },
          {
            onSuccess: () => onClose(true),
            onSettled: () => setSubmitting(false),
          }
        );
      } else {
        createMutation.mutate(submitValues, {
          onSuccess: () => onClose(true),
          onSettled: () => setSubmitting(false),
        });
      }
    } catch (err) {
      // Nếu validateFields lỗi thì không làm gì, form sẽ tự hiển thị lỗi
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
        <Form form={form} layout="vertical" disabled={isSubmitting} onValuesChange={handleFormValuesChange}>
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
          <Form.Item name="startTime" label="Start Time" rules={[{ required: true, message: "Please select start time" }]}>
            <TimePicker style={{ width: "100%" }} format="HH:mm" />
          </Form.Item>
          <Form.Item name="endTime" label="End Time" rules={[{ required: true, message: "Please select end time" }]}>
            <TimePicker style={{ width: "100%" }} format="HH:mm" />
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
