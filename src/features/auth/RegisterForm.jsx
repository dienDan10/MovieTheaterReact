import { FaKey, FaUser, FaEnvelope } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import { Form, Input } from "antd";
import { SpinnerSmall } from "../../components/Spinner";
import { useNavigate } from "react-router-dom";
import { useRegister } from "./useRegister";

function RegisterForm() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { isPending, mutate: register } = useRegister();

  const onSubmit = ({ email, password, username }) => {
    register(
      { email, password, username },
      {
        onSuccess: () => {
          form.resetFields();
          navigate("/login");
        },
      }
    );
  };
  return (
    <div className="w-full h-[calc(100vh-4rem)] flex items-center justify-center px-2 md:px-0">
      <div className="bg-white px-3 py-5 sm:px-10 sm:py-8 rounded-md max-w-[600px] w-full">
        <div className="text-center mb-6 flex flex-col items-center">
          <FaCheckCircle className="text-6xl text-red-700 mb-2" />
          <h1 className="text-2xl font-semibold text-gray-800">Register</h1>
          <p className="text-gray-500">
            New to Cinemax? Register to create an account and enjoy our
            services.
          </p>
        </div>
        <Form form={form} onFinish={onSubmit} layout="vertical">
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Please input your username!" },
              {
                min: 3,
                message: "Username must be at least 3 characters long!",
              },
              {
                max: 20,
                message: "Username must be at most 20 characters long!",
              },
              {
                pattern: /^[a-zA-Z0-9_]+( [a-zA-Z0-9_]+)*$/,
                message:
                  "Username can only contain letters, numbers and underscore!",
              },
            ]}
          >
            <Input
              prefix={<FaUser className="text-slate-700 mx-2" />}
              placeholder="Username"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              {
                type: "email",
                message: "Please enter a valid email address!",
              },
            ]}
          >
            <Input
              prefix={<FaEnvelope className="text-slate-700 mx-2" />}
              placeholder="Email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              {
                min: 6,
                message: "Password must be at least 6 characters long!",
              },
              {
                max: 20,
                message: "Password must be at most 20 characters long!",
              },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\w\W]{6,20}$/,
                message:
                  "Password must contain at least one uppercase letter, one lowercase letter, and one number!",
              },
            ]}
          >
            <Input.Password
              prefix={<FaKey className="text-slate-700 mx-2" />}
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<FaKey className="text-slate-700 mx-2" />}
              placeholder="Confirm Password"
            />
          </Form.Item>

          {isPending && (
            <div className="w-full flex justify-center items-center">
              <SpinnerSmall />
            </div>
          )}
          {!isPending && (
            <button
              onClick={() => form.submit()}
              type="button"
              className="w-full bg-red-700 hover:cursor-pointer font-semibold text-white py-2 px-4 rounded-3xl shadow-sm hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
            >
              Register
            </button>
          )}
        </Form>

        <div className="mt-2 mb-2">
          <p className="mt-2 text-center">
            <span>Already have an account? </span>
            <span
              className="text-main-900 font-bold hover:underline cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Sign in here!
            </span>
          </p>
          <p className="text-sm text-center mt-2 hover:underline">
            <a href="/">Back to home</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
