import React from "react";
import { Button, Result } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetBookingConfirm } from "../../../../redux/bookingConfirmSlice";

function VerifyError() {
  const { errorMessage } = useSelector((state) => state.bookingConfirm);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoHome = () => {
    dispatch(resetBookingConfirm());
    navigate("/");
  };

  return (
    <div className="bg-neutral-800 h-screen flex justify-center items-center py-8 px-5">
      <div className="max-w-[600px] w-full bg-neutral-50 rounded-md p-8">
        <Result
          status="error"
          title="Payment Verification Failed"
          subTitle={
            errorMessage || "There was an error processing your payment."
          }
          extra={[
            <Button
              key="home"
              type="primary"
              onClick={handleGoHome}
              className="bg-blue-500"
            >
              Back to Home
            </Button>,
          ]}
        />
      </div>
    </div>
  );
}

export default VerifyError;
