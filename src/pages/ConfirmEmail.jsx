import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useConfirmEmail } from "./useConfirmEmail";
import { Button, Result, Spin } from "antd";

function ConfirmEmail() {
  const [searchParams] = useSearchParams();
  const [confirmationStatus, setConfirmationStatus] = useState({
    isLoading: true,
    isSuccess: false,
    isError: false,
    errorMessage: "",
  });

  const { mutate: confirmEmail, isPending } = useConfirmEmail();

  useEffect(() => {
    const userId = searchParams.get("userId");
    const token = searchParams.get("token");

    if (userId && token) {
      confirmEmail(
        { userId, token },
        {
          onSuccess: () => {
            setConfirmationStatus({
              isLoading: false,
              isSuccess: true,
              isError: false,
              errorMessage: "",
            });
          },
          onError: (error) => {
            setConfirmationStatus({
              isLoading: false,
              isSuccess: false,
              isError: true,
              errorMessage:
                error.response?.data?.message || "Email confirmation failed",
            });
          },
        }
      );
    } else {
      setConfirmationStatus({
        isLoading: false,
        isSuccess: false,
        isError: true,
        errorMessage: "Invalid confirmation link",
      });
    }
  }, [searchParams, confirmEmail]);

  if (confirmationStatus.isLoading || isPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Spin size="large" />
        <p className="mt-4 text-lg">Confirming your email address...</p>
      </div>
    );
  }

  if (confirmationStatus.isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Result
          status="success"
          title="Email Confirmed Successfully!"
          subTitle="Your email address has been verified. You can now log in to your account."
          extra={[
            <Button type="primary" key="login">
              <Link to="/login">Log in now</Link>
            </Button>,
          ]}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Result
        status="error"
        title="Confirmation Failed"
        subTitle={
          confirmationStatus.errorMessage ||
          "There was an issue confirming your email address."
        }
        extra={[
          <Button type="primary" key="home">
            <Link to="/">Go to Homepage</Link>
          </Button>,
        ]}
      />
    </div>
  );
}

export default ConfirmEmail;
