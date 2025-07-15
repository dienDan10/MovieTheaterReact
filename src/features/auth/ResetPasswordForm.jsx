import { Form, Input } from "antd";
import { FaCircleUser, FaKey } from "react-icons/fa6";
import { useResetPassword } from "./useResetPassword";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { SpinnerSmall } from "../../components/Spinner";

function ResetPasswordForm() {
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const [params, setParams] = useState({ userId: "", resetToken: "" });
  const { mutate: resetUserPassword, isPending } = useResetPassword();

  useEffect(() => {
    // Extract userId and token from URL search params
    const searchParams = new URLSearchParams(location.search);
    const userId = searchParams.get("userId");
    const token = searchParams.get("token");

    if (userId && token) {
      setParams({ userId, resetToken: token });
    }
  }, [location]);

  const onFinish = (values) => {
    if (!params.userId || !params.resetToken) {
      return;
    }

    resetUserPassword({
      userId: params.userId,
      resetToken: params.resetToken,
      password: values.password,
    });
  };

  if (!params.userId || !params.resetToken) {
    return (
      <div className="w-full h-[calc(100vh-4rem)] flex items-center justify-center px-2 md:px-0">
        <div className="bg-white px-3 py-5 sm:px-10 sm:py-8 rounded-md max-w-[600px] w-full">
          <div className="text-center mb-6 flex flex-col items-center">
            <FaCircleUser className="text-6xl text-red-700 mb-2" />
            <h1 className="text-2xl font-semibold text-gray-800">
              Invalid or Expired Link
            </h1>
            <p className="text-gray-500">
              The password reset link is invalid or has expired. Please request
              a new one.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="w-full bg-red-700 hover:cursor-pointer font-semibold text-white py-2 px-4 rounded-3xl shadow-sm hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
          >
            Request New Reset Link
          </button>

          <div className="mt-2 mb-2 px-5">
            <p className="text-sm text-center mt-2 hover:underline">
              <a href="/">Back to home</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex items-center justify-center px-2 md:px-0">
      <div className="bg-white px-3 py-5 sm:px-10 sm:py-8 rounded-md max-w-[600px] w-full">
        <div className="text-center mb-6 flex flex-col items-center">
          <FaCircleUser className="text-6xl text-red-700 mb-2" />
          <h1 className="text-2xl font-semibold text-gray-800">
            Reset Your Password
          </h1>
          <p className="text-gray-500">Please enter your new password below</p>
        </div>

        <Form form={form} onFinish={onFinish}>
          <Form.Item
            name="password"
            required
            rules={[
              { required: true, message: "Please enter your new password" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password
              prefix={<FaKey className="text-slate-700 mx-2" />}
              placeholder="New password"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            required
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<FaKey className="text-slate-700 mx-2" />}
              placeholder="Confirm new password"
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
              Reset Password
            </button>
          )}
        </Form>

        <div className="mt-2 mb-2 px-5">
          <div className="w-full flex justify-center items-center">
            <p className="mt-2 text-center">
              <span>Remember your password? </span>
              <span
                className="text-neutral-900 font-bold hover:underline hover:text-red-600 cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Back to login
              </span>
            </p>
          </div>
          <p className="text-sm text-center mt-2 hover:underline">
            <a href="/">Back to home</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordForm;
