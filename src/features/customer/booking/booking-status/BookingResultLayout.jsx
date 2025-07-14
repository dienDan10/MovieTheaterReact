import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
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
  const { mutate: verifyPayment, isLoading: isVerifying } = useVerifyPayment();

  // Get booking details query
  const { data: bookingDetails, isLoading: isLoadingDetails } =
    useGetBookingDetail(verificationStatus === "success" ? paymentId : null);

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

  return (
    <div className="bg-neutral-800">
      <PaymentInformation />
    </div>
  );
}

export default BookingResultLayout;
