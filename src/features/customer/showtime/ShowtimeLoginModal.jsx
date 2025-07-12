import { Modal, Form, Input } from "antd";
import { FaCircleUser, FaKey } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { SpinnerSmall } from "../../../components/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { doLoginAction } from "../../../redux/userSlice";
import { closeLoginModal } from "../../../redux/showtimeSlice";
import { useMutation } from "@tanstack/react-query";
import { login as loginApi } from "../../../services/apiAuth";
import { notify } from "../../../redux/notificationSlice";
import {
  ERROR_NOTIFICATION,
  SUCCESS_NOTIFICATION,
} from "../../../utils/constant";
import { doGetProfileAction } from "../../../redux/userSlice";
import { useNavigate } from "react-router-dom";

function ShowtimeLoginModal() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoginModalOpen, selectedShowtimeId } = useSelector(
    (state) => state.showtime
  );

  const { isPending, mutate: login } = useMutation({
    mutationFn: async ({ email, password }) => {
      const response = await loginApi({ email, password });
      return response.data;
    },
    onSuccess: (data) => {
      dispatch(
        notify({
          type: SUCCESS_NOTIFICATION,
          message: "Login Successful",
          description: "You have successfully logged in.",
        })
      );

      dispatch(doGetProfileAction(data.data.user));
      localStorage.setItem("accessToken", data.data.accessToken);
      dispatch(doLoginAction());
      form.resetFields();
      dispatch(closeLoginModal());

      // Navigate to booking if we have a showtime ID
      if (selectedShowtimeId) {
        navigate(`/booking/${selectedShowtimeId}`);
      }
    },
    onError: (error) => {
      dispatch(
        notify({
          type: ERROR_NOTIFICATION,
          message: "Login Failed",
          description:
            error.response?.data?.message || "An error occurred during login.",
        })
      );
    },
  });

  const onSubmit = ({ email, password }) => {
    login({ email, password });
  };

  const handleCancel = () => {
    dispatch(closeLoginModal());
    form.resetFields();
  };

  return (
    <Modal
      title={
        <div className="text-center flex flex-col items-center">
          <FaCircleUser className="text-4xl text-red-700 mb-2" />
          <h1 className="text-xl font-semibold text-gray-800">Sign In</h1>
          <p className="text-sm text-gray-500">
            Sign in to continue booking your tickets
          </p>
        </div>
      }
      open={isLoginModalOpen}
      onCancel={handleCancel}
      footer={null}
      width={400}
      centered
    >
      <Form form={form} onFinish={onSubmit} layout="vertical">
        <Form.Item
          name="email"
          required
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input
            prefix={<IoIosMail className="text-slate-700 text-xl mx-2" />}
            placeholder="Email"
          />
        </Form.Item>

        <Form.Item
          name="password"
          required
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            prefix={<FaKey className="text-slate-700 mx-2" />}
            placeholder="Password"
          />
        </Form.Item>
        {isPending ? (
          <div className="w-full flex justify-center items-center">
            <SpinnerSmall />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => form.submit()}
            className="w-full bg-red-700 hover:cursor-pointer font-semibold text-white py-2 px-4 rounded-3xl shadow-sm hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
          >
            Sign In
          </button>
        )}
      </Form>

      <div className="mt-2 mb-2 text-center">
        <p className="mt-2">
          <span>Newcomer? </span>
          <a
            href="/register"
            className="text-main-900 font-bold hover:underline"
          >
            Sign up here!
          </a>
        </p>
      </div>
    </Modal>
  );
}

export default ShowtimeLoginModal;
