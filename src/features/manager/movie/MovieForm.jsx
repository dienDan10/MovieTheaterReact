import { Modal, Form, Input, Button, Spin, InputNumber, DatePicker } from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useCreateMovie } from "./useCreateMovie";
import { useUpdateMovie } from "./useUpdateMovie";
import { useQuery } from "@tanstack/react-query";
import { getMovieById } from "../../../services/apiMovie";
import dayjs from "dayjs";

const { TextArea } = Input;

function MovieForm({ open, onClose, movieId, mode }) {
  const [form] = Form.useForm();
  const isEdit = mode === "edit";

  // Query movie detail for edit mode
  const { data: movie, isPending: isLoadingMovie } = useQuery({
    queryKey: ["movie-edit", movieId],
    queryFn: async () => {
      if (!isEdit || !movieId) return null;
      const res = await getMovieById(movieId);
      return res.data;
    },
    enabled: isEdit && !!movieId && open,
    staleTime: 0,
    cacheTime: 0,
  });

  const createMutation = useCreateMovie();
  const updateMutation = useUpdateMovie();
  const [submitting, setSubmitting] = useState(false);

  // Set form fields when movie data is loaded (for edit mode)
  useEffect(() => {
    if (movie && isEdit) {
      form.setFieldsValue({
        title: movie.title || "",
        genre: movie.genre || "",
        director: movie.director || "",
        cast: movie.cast || "",
        description: movie.description || "",
        duration: movie.duration || 0,
        releaseDate: movie.releaseDate ? dayjs(movie.releaseDate) : null,
        posterUrl: movie.posterUrl || "",
        trailerUrl: movie.trailerUrl || "",
      });
    }
  }, [movie, form, isEdit]);

  // Reset form when modal is opened/closed
  useEffect(() => {
    if (open && !isEdit) {
      form.resetFields();
    }
  }, [open, form, isEdit]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    setSubmitting(true);
    // Chuyển releaseDate về dạng string yyyy-MM-dd nếu có
    const submitValues = {
      ...values,
      releaseDate: values.releaseDate ? values.releaseDate.format("YYYY-MM-DD") : null,
    };
    if (isEdit) {
      updateMutation.mutate(
        { id: movieId, ...submitValues },
        {
          onSuccess: () => {
            onClose(true);
          },
          onSettled: () => {
            setSubmitting(false);
          },
        }
      );
    } else {
      createMutation.mutate(submitValues, {
        onSuccess: () => {
          onClose(true);
        },
        onSettled: () => {
          setSubmitting(false);
        },
      });
    }
  };

  const isSubmitting = submitting || createMutation.isPending || updateMutation.isPending;
  const modalTitle = isEdit ? "Edit Movie" : "Create Movie";

  return (
    <Modal
      title={modalTitle}
      open={open}
      onCancel={() => onClose(false)}
      footer={[
        <Button key="cancel" onClick={() => onClose(false)} disabled={isSubmitting}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isSubmitting}
          onClick={handleSubmit}
          disabled={isSubmitting || (isEdit && isLoadingMovie)}
        >
          {isEdit ? "Update" : "Create"}
        </Button>,
      ]}
      maskClosable={!isSubmitting}
      closable={!isSubmitting}
    >
      <Spin spinning={isEdit && isLoadingMovie}>
        <Form form={form} layout="vertical" disabled={isSubmitting}>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: "Please enter movie title" }]}
          >
            <Input placeholder="Enter movie title" />
          </Form.Item>
          <Form.Item
            name="genre"
            label="Genre"
            rules={[{ required: true, message: "Please enter genre" }]}
          >
            <Input placeholder="Enter genre" />
          </Form.Item>
          <Form.Item
            name="director"
            label="Director"
            rules={[{ required: true, message: "Please enter director" }]}
          >
            <Input placeholder="Enter director" />
          </Form.Item>
          <Form.Item
            name="cast"
            label="Cast"
            rules={[{ required: true, message: "Please enter cast" }]}
          >
            <Input placeholder="Enter cast" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <TextArea rows={4} placeholder="Enter movie description" />
          </Form.Item>
          <Form.Item
            name="duration"
            label="Duration (minutes)"
            rules={[{ required: true, message: "Please enter duration" }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} placeholder="Enter duration in minutes" />
          </Form.Item>
          <Form.Item
            name="releaseDate"
            label="Release Date"
            rules={[{ required: true, message: "Please select release date" }]}
          >
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="posterUrl" label="Poster URL">
            <Input placeholder="Enter poster URL (optional)" />
          </Form.Item>
          <Form.Item name="trailerUrl" label="Trailer URL">
            <Input placeholder="Enter trailer URL (optional)" />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
}

MovieForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  movieId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  mode: PropTypes.oneOf(["edit", "create"]).isRequired,
};

export default MovieForm;
