import { Form, Input } from "antd";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserInformation } from "../../../../redux/bookingSlice";

function UserInformation() {
  const [form] = Form.useForm();
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    form.setFieldsValue({
      username: user?.name || "",
      email: user?.email || "",
    });

    dispatch(
      setUserInformation({
        username: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
      })
    );
  }, [form, user, dispatch]);

  const handleValuesChange = (changedValues, allValues) => {
    // Handle form value changes if needed
    dispatch(setUserInformation(allValues));
  };

  return (
    <div className="w-full mx-auto bg-[#f9fbfd] rounded-lg shadow-md text-sm overflow-hidden mt-4">
      <div className="border-b border-gray-200 text-gray-500 font-medium px-5 pt-4 pb-5 bg-stone-200">
        Thông tin người dùng
      </div>

      <div className="p-5">
        <Form form={form} layout="vertical" onValuesChange={handleValuesChange}>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Form.Item
              label={"Họ và tên"}
              name="username"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Vui lòng nhập họ và tên!",
                },
              ]}
              style={{ flex: "1", minWidth: "200px" }}
            >
              <Input
                placeholder="Nhập họ và tên"
                style={{
                  height: "40px",
                  borderRadius: "6px",
                }}
              />
            </Form.Item>

            <Form.Item
              label={"Số điện thoại"}
              name="phone"
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Vui lòng nhập số điện thoại!",
                },
                {
                  pattern: /^[0-9]{10,11}$/,
                  message: "Số điện thoại không hợp lệ!",
                },
              ]}
              style={{ flex: "1", minWidth: "200px" }}
            >
              <Input
                placeholder="Nhập số điện thoại"
                style={{
                  height: "40px",
                  borderRadius: "6px",
                }}
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
              style={{ flex: "1", minWidth: "200px" }}
            >
              <Input
                placeholder="Nhập email"
                style={{
                  height: "40px",
                  borderRadius: "6px",
                }}
              />
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default UserInformation;
