import {
  Modal,
  Form,
  Input,
  Button,
  Spin,
  InputNumber,
  DatePicker,
  Upload,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useCreateMovie } from "./useCreateMovie";
import { useUpdateMovie } from "./useUpdateMovie";
import { useGetMovieById } from "./useGetMovieById";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Dragger } = Upload;

function MovieForm({ open, onClose, movieId, mode }) {
  const [form] = Form.useForm();
  const isEdit = mode === "edit";
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Query movie detail for edit mode
  const { movie, isPending: isLoadingMovie } = useGetMovieById(movieId);

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
        trailerUrl: movie.trailerUrl || "",
      });

      // Set image preview for existing poster
      if (movie.posterUrl) {
        setImagePreview(movie.posterUrl);
      }
    }
  }, [movie, form, isEdit]);

  // Reset form when modal is opened/closed
  useEffect(() => {
    if (open && !isEdit) {
      form.resetFields();
      setImagePreview(null);
      setImageFile(null);
    }
  }, [open, form, isEdit]);

  const handleSubmit = async () => {
    const values = await form.validateFields();
    setSubmitting(true);

    // Prepare form data
    const submitValues = {
      ...values,
      releaseDate: values.releaseDate
        ? values.releaseDate.format("YYYY-MM-DD")
        : null,
      imageFile: imageFile,
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

  // eslint-disable-next-line no-unused-vars
  const customRequest = ({ file, onSuccess, onProgress, onError }) => {
    if (file) {
      setImageFile(file);

      // Create preview immediately
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImagePreview(reader.result);
      });
      reader.readAsDataURL(file);
    }

    setTimeout(() => {
      onSuccess("ok");
    }, 1000);
  };

  const handleRemoveFile = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const isSubmitting =
    submitting || createMutation.isPending || updateMutation.isPending;
  const modalTitle = isEdit ? "Edit Movie" : "Create Movie";

  return (
    <Modal
      title={modalTitle}
      open={open}
      onCancel={() => onClose(false)}
      width={800}
      footer={[
        <Button
          key="cancel"
          onClick={() => onClose(false)}
          disabled={isSubmitting}
        >
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
            label={<span className="font-medium">Movie Details</span>}
            className="mb-0"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title & Genre - First row */}
              <Form.Item
                name="title"
                label="Title"
                rules={[
                  { required: true, message: "Please enter movie title" },
                ]}
                className="mb-2"
              >
                <Input placeholder="Enter movie title" />
              </Form.Item>
              <Form.Item
                name="genre"
                label="Genre"
                rules={[{ required: true, message: "Please enter genre" }]}
                className="mb-2"
              >
                <Input placeholder="Enter genre" />
              </Form.Item>

              {/* Director & Cast - Second row */}
              <Form.Item
                name="director"
                label="Director"
                rules={[{ required: true, message: "Please enter director" }]}
                className="mb-2"
              >
                <Input placeholder="Enter director" />
              </Form.Item>
              <Form.Item
                name="cast"
                label="Cast"
                rules={[{ required: true, message: "Please enter cast" }]}
                className="mb-2"
              >
                <Input placeholder="Enter cast" />
              </Form.Item>

              {/* Duration & Release Date - Third row */}
              <Form.Item
                name="duration"
                label="Duration (minutes)"
                rules={[{ required: true, message: "Please enter duration" }]}
                className="mb-2"
              >
                <InputNumber
                  min={1}
                  style={{ width: "100%" }}
                  placeholder="Enter duration in minutes"
                />
              </Form.Item>
              <Form.Item
                name="releaseDate"
                label="Release Date"
                rules={[
                  { required: true, message: "Please select release date" },
                ]}
                className="mb-2"
              >
                <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
              </Form.Item>

              {/* Trailer URL - Fourth row */}
              <Form.Item
                name="trailerUrl"
                label="Trailer URL"
                className="mb-2 md:col-span-2"
              >
                <Input placeholder="Enter trailer URL (optional)" />
              </Form.Item>
            </div>
          </Form.Item>

          {/* Description - Full width */}
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <TextArea rows={4} placeholder="Enter movie description" />
          </Form.Item>

          {/* Movie Poster - Full width */}
          <Form.Item label="Movie Poster" name="poster">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              {/* Image preview on the left */}
              <div className="w-full md:w-1/3 flex justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      objectFit: "contain",
                      borderRadius: "4px",
                      border: "1px solid #d9d9d9",
                    }}
                  />
                ) : (
                  <div
                    className="flex items-center justify-center bg-gray-100 text-gray-400"
                    style={{
                      width: "150px",
                      height: "200px",
                      borderRadius: "4px",
                      border: "1px dashed #d9d9d9",
                    }}
                  >
                    No Image
                  </div>
                )}
              </div>

              {/* Upload control on the right */}
              <div className="w-full md:w-2/3">
                <Dragger
                  name="poster"
                  accept="image/png, image/jpg, image/jpeg"
                  customRequest={customRequest}
                  onRemove={handleRemoveFile}
                  multiple={false}
                  maxCount={1}
                  showUploadList={true}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                  <p className="ant-upload-hint">
                    Upload movie poster (jpg, jpeg, png)
                  </p>
                </Dragger>
              </div>
            </div>
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
