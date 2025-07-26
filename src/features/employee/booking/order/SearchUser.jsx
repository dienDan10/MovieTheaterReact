import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Alert,
  Spin,
  Divider,
  Badge,
  Space,
  Tag,
} from "antd";
import { UserOutlined, SearchOutlined, GiftOutlined } from "@ant-design/icons";
import { useGetUserProfileByEmail } from "./useGetUserProfileByEmail";
import EmployeePointsDiscount from "./EmployeePointsDiscount";
import { useDispatch } from "react-redux";
import { setSelectedCustomer } from "../../../../redux/employeeBookingSlice";

function SearchUser() {
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const dispatch = useDispatch();

  const {
    data: userResponse,
    isLoading,
    error,
    isError,
  } = useGetUserProfileByEmail(submittedEmail, {
    enabled: !!submittedEmail,
  });

  const userData = userResponse?.data?.data;

  // Update the selectedCustomer in redux when userData changes
  useEffect(() => {
    if (userData) {
      dispatch(setSelectedCustomer(userData));
    } else if (isError) {
      dispatch(setSelectedCustomer(null));
    }
  }, [userData, isError, dispatch]);

  const handleSubmit = (values) => {
    setSubmittedEmail(values.email);
  };

  return (
    <>
      <div className="mb-4">
        <Card
          title={
            <span>
              <UserOutlined className="mr-2" />
              Tìm khách hàng
            </span>
          }
        >
          <Form layout="inline" onFinish={handleSubmit}>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please enter an email address!" },
                {
                  type: "email",
                  message: "Please enter a valid email address!",
                },
              ]}
              style={{ width: "100%", marginBottom: "16px" }}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Customer email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                allowClear
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                htmlType="submit"
                loading={isLoading}
              >
                Search
              </Button>
            </Form.Item>
          </Form>

          {isLoading && (
            <div className="flex justify-center my-4">
              <Spin tip="Searching..." />
            </div>
          )}

          {isError && (
            <Alert
              message="Customer Not Found"
              description={
                error?.response?.status === 404
                  ? "No customer account exists with this email address."
                  : "An error occurred while searching for the customer."
              }
              type="error"
              showIcon
              className="mt-4"
            />
          )}

          {userData && (
            <div className="mt-4">
              <Divider orientation="left">Thông tin khách hàng</Divider>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p>
                    <strong>Tên:</strong> {userData.displayName}
                  </p>
                  <p>
                    <strong>Email:</strong> {userData.email}
                  </p>
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <GiftOutlined
                      className="text-red-500 mr-2"
                      style={{ fontSize: "1.2rem" }}
                    />
                    <span className="font-semibold">Điểm tích lũy: </span>
                    <Tag color="green">{userData.point || 0}</Tag>
                  </div>

                  {userData.point === 0 && (
                    <p className="text-gray-500">
                      Khách hàng này không có điểm nào để sử dụng.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Render the EmployeePointsDiscount component when a customer with points is found */}
      {userData && userData.point > 0 && (
        <EmployeePointsDiscount customerData={userData} />
      )}
    </>
  );
}

export default SearchUser;
