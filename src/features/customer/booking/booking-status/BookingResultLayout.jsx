import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button, Result } from "antd";
import PaymentInformation from "./PaymentInformation";
import VerifingDialog from "./VerifingDialog";
import VerifyError from "./VerifyError";
import { useVerifyPayment } from "./useVerifyPayment";
import { useGetBookingDetail } from "./useGetBookingDetail";
import {
  startVerification,
  verificationSuccess,
  verificationFailed,
  setPaymentDetails,
} from "../../../../redux/bookingConfirmSlice";

function BookingResultLayout() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("paymentId");
  const { verificationStatus } = useSelector((state) => state.bookingConfirm);

  // Get verification mutation
  const { mutate: verifyPayment, isPending: isVerifying } = useVerifyPayment();

  const navigate = useNavigate();

  // Get booking details query
  const {
    data: bookingDetails,
    isLoading: isLoadingDetails,
    error: bookingDetailsError,
  } = useGetBookingDetail(verificationStatus === "success" ? paymentId : null);

  // Start verification process on component mount
  useEffect(() => {
    if (paymentId) {
      dispatch(startVerification());
      verifyPayment(
        {},
        {
          onSuccess: (data) => {
            dispatch(verificationSuccess({ paymentId: data.data.paymentId }));
          },
          onError: (error) => {
            const errorMessage = error.message || "Failed to verify payment";
            dispatch(verificationFailed(errorMessage));
          },
        }
      );
    } else {
      dispatch(verificationFailed("No payment ID found"));
    }
  }, [paymentId, dispatch, verifyPayment]);

  // Store booking details in redux when loaded
  useEffect(() => {
    if (bookingDetails && !isLoadingDetails) {
      dispatch(setPaymentDetails(bookingDetails.data));
    }
  }, [bookingDetails, isLoadingDetails, dispatch]);

  // Render appropriate component based on verification status
  if (verificationStatus === "pending" || isVerifying) {
    return <VerifingDialog />;
  }

  if (verificationStatus === "error") {
    return <VerifyError />;
  }

  if (verificationStatus === "success" && isLoadingDetails) {
    return <VerifingDialog />;
  }

  // Handle the case when verification was successful but fetching booking details failed
  if (verificationStatus === "success" && bookingDetailsError) {
    return (
      <div className="bg-neutral-800 h-screen flex justify-center py-60 px-5">
        <div className="flex flex-col items-center gap-6 max-h-[200px] justify-center max-w-[400px] w-full bg-neutral-50 rounded-md px-6 py-8">
          <Result
            status="error"
            title="Failed to Load Booking Details"
            subTitle="We verified your payment, but couldn't retrieve your booking details. Please contact customer support."
            extra={[
              <Button
                key="home"
                type="primary"
                className="bg-red-600!"
                onClick={() => navigate("/")}
              >
                Back to Home
              </Button>,
              <Button key="retry" onClick={() => window.location.reload()}>
                Try Again
              </Button>,
            ]}
          />
        </div>
      </div>
    );
  }

  // If there are no payment details (even though verification was successful)
  if (
    verificationStatus === "success" &&
    !isLoadingDetails &&
    !bookingDetailsError &&
    (!bookingDetails || !bookingDetails.data)
  ) {
    return (
      <div className="bg-neutral-800 h-screen flex justify-center py-20 px-5">
        <Result
          status="warning"
          title="No Booking Details Found"
          subTitle="Your payment was verified but no booking details were found. Please contact customer support."
          extra={[
            <Button
              key="home"
              type="primary"
              className="bg-red-600"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>,
          ]}
        />
      </div>
    );
  }

  return (
    <div className="bg-neutral-800">
      <PaymentInformation />
    </div>
  );
}

export default BookingResultLayout;
