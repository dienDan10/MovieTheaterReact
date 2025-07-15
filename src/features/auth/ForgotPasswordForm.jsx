import { Form, Input } from "antd";
import { FaCircleUser } from "react-icons/fa6";
import { IoIosMail } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useForgotPassword } from "./useForgotPassword";
import { SpinnerSmall } from "../../components/Spinner";

function ForgotPasswordForm() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { mutate: sendPasswordResetEmail, isPending } = useForgotPassword();

  const onFinish = (values) => {
    sendPasswordResetEmail({ email: values.email });
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex items-center justify-center px-2 md:px-0">
      <div className="bg-white px-3 py-5 sm:px-10 sm:py-8 rounded-md max-w-[600px] w-full">
        <div className="text-center mb-6 flex flex-col items-center">
          <FaCircleUser className="text-6xl text-red-700 mb-2" />
          <h1 className="text-2xl font-semibold text-gray-800">
            Forgot Password
          </h1>
          <p className="text-gray-500">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </p>
        </div>

        <Form form={form} onFinish={onFinish}>
          <Form.Item
            name="email"
            required
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              prefix={<IoIosMail className="text-slate-700 text-xl mx-2" />}
              placeholder="Email"
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
              Send Reset Link
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

export default ForgotPasswordForm;
