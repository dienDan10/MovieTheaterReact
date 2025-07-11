import { useState, useEffect } from "react";
import { Form, Input, Button, Modal, InputNumber, Upload, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import {
  toggleFormVisibility,
  clearSelectedConcession,
} from "../../../redux/concessionSlice";
import { useCreateConcession } from "./useCreateConcession";
import { useUpdateConcession } from "./useUpdateConcession";

const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

const validateMessages = {
  required: "${label} is required!",
  types: {
    number: "${label} must be a valid number!",
  },
  number: {
    min: "${label} must be at least ${min}!",
  },
};

function ConcessionForm() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { formVisible, formMode, selectedConcession } = useSelector(
    (state) => state.concession
  );

  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const { mutate: createConcession, isPending: isCreating } =
    useCreateConcession();
  const { mutate: updateConcession, isPending: isUpdating } =
    useUpdateConcession();

  const isPending = isCreating || isUpdating;
  const isEditMode = formMode === "edit";

  useEffect(() => {
    if (formVisible) {
      if (isEditMode && selectedConcession) {
        form.setFieldsValue({
          name: selectedConcession.name,
          description: selectedConcession.description,
          price: selectedConcession.price,
        });

        // Set image if available
        if (selectedConcession.imageUrl) {
          setFileList([
            {
              uid: "-1",
              name: "concession-image.png",
              status: "done",
              url: selectedConcession.imageUrl,
            },
          ]);
        } else {
          setFileList([]);
        }
      } else {
        form.resetFields();
        setFileList([]);
      }
    }
  }, [formVisible, selectedConcession, isEditMode, form]);

  const handleCancel = () => {
    dispatch(toggleFormVisibility(false));
    dispatch(clearSelectedConcession());
    form.resetFields();
    setFileList([]);
  };

  const handleSubmit = (values) => {
    const imageFile = fileList[0]?.originFileObj;

    if (isEditMode && selectedConcession) {
      updateConcession(
        {
          id: selectedConcession.id,
          name: values.name,
          description: values.description,
          price: values.price,
          imageFile,
        },
        {
          onSuccess: () => {
            handleCancel();
          },
        }
      );
    } else {
      createConcession(
        {
          name: values.name,
          description: values.description,
          price: values.price,
          imageFile,
        },
        {
          onSuccess: () => {
            handleCancel();
          },
        }
      );
    }
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
    }
    const isLessThan2MB = file.size / 1024 / 1024 < 2;
    if (!isLessThan2MB) {
      message.error("Image must be smaller than 2MB!");
    }
    return isImage && isLessThan2MB;
  };

  return (
    <Modal
      title={isEditMode ? "Edit Concession" : "Add Concession"}
      open={formVisible}
      onCancel={handleCancel}
      footer={null}
      width={700}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        validateMessages={validateMessages}
        className="mt-4"
      >
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input placeholder="Enter concession name" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={4} placeholder="Enter concession description" />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price (VND)"
          rules={[{ required: true }, { type: "number", min: 1000 }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Enter price"
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            min={1000}
          />
        </Form.Item>

        <Form.Item label="Image">
          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            beforeUpload={beforeUpload}
            maxCount={1}
            accept="image/*"
          >
            {fileList.length >= 1 ? null : uploadButton}
          </Upload>
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={() => setPreviewOpen(false)}
          >
            <img alt="preview" style={{ width: "100%" }} src={previewImage} />
          </Modal>
        </Form.Item>

        <div className="flex justify-end gap-2 mt-4">
          <Button onClick={handleCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={isPending}>
            {isEditMode ? "Update" : "Create"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default ConcessionForm;
