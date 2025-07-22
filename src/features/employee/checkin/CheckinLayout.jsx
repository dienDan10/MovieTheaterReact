import { useState } from "react";
import { Alert } from "antd";
import SearchTicketForm from "./SearchTicketForm";
import TicketDetail from "./TicketDetail";
import { useCheckinTicket } from "./useCheckinTicket";
import { useGetBookingDetail } from "../../customer/booking/booking-status/useGetBookingDetail";
import { useDispatch } from "react-redux";
import { notify } from "../../../redux/notificationSlice";
import {
  ERROR_NOTIFICATION,
  SUCCESS_NOTIFICATION,
} from "../../../utils/constant";

function CheckinLayout() {
  const [paymentId, setPaymentId] = useState(null);
  const [checkinStatus, setCheckinStatus] = useState("Not Checked In");
  const [showTicketDetail, setShowTicketDetail] = useState(false);
  const [errorType, setErrorType] = useState(null);
  const dispatch = useDispatch();
  // Get booking details using the hook from customer module
  const {
    data: bookingData,
    isLoading: isLoadingBooking,
    error: bookingError,
  } = useGetBookingDetail(paymentId);

  // Check-in ticket mutation
  const { mutate: checkinTicket, isLoading: isCheckinLoading } =
    useCheckinTicket();

  // Handle check-in process
  const handleCheckin = (extractedPaymentId) => {
    // Reset error states
    setErrorType(null);
    setPaymentId(extractedPaymentId);

    // Call the check-in API
    checkinTicket(extractedPaymentId, {
      onSuccess: () => {
        setCheckinStatus("Checked In");
        setShowTicketDetail(true);
        dispatch(
          notify({
            type: SUCCESS_NOTIFICATION,
            message: "Ticket checked in successfully!",
          })
        );
      },
      onError: (error) => {
        setShowTicketDetail(true); // Still show the ticket details

        // Handle specific error codes
        if (error.response) {
          const { status } = error.response;
          console.log("Check-in error response:", error.response);

          if (status === 404) {
            // Ticket does not exist
            setErrorType("NOT_FOUND");
            dispatch(
              notify({
                type: ERROR_NOTIFICATION,
                message: "Ticket not found. Please verify the ticket ID.",
              })
            );
          } else if (status === 400) {
            // Ticket already checked in
            setErrorType("ALREADY_CHECKED_IN");

            dispatch(
              notify({
                type: ERROR_NOTIFICATION,
                message: "This ticket has already been checked in.",
              })
            );
          } else {
            // Generic error
            setErrorType("GENERAL_ERROR");
            dispatch(
              notify({
                type: ERROR_NOTIFICATION,
                message: error?.message || "Failed to check in ticket",
              })
            );
          }
        } else {
          // Network error or unexpected error structure
          setErrorType("GENERAL_ERROR");
          dispatch(
            notify({
              type: ERROR_NOTIFICATION,
              message: "An unexpected error occurred. Please try again.",
            })
          );
        }
      },
    });
  };

  // Show error if booking data fetch fails
  if (bookingError && showTicketDetail) {
    dispatch(
      notify({
        type: ERROR_NOTIFICATION,
        message: "Failed to load ticket details",
      })
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {!showTicketDetail ? (
        <SearchTicketForm onCheckin={handleCheckin} />
      ) : (
        <div>
          <button
            onClick={() => {
              setShowTicketDetail(false);
              setPaymentId(null);
              setCheckinStatus("Not Checked In");
              setErrorType(null);
            }}
            className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
          >
            ← Back to Search
          </button>

          {/* Show error alert for NOT_FOUND error instead of ticket details */}
          {errorType === "NOT_FOUND" ? (
            <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md">
              <Alert
                message="Ticket Not Found"
                description="This ticket ID does not exist in our system. Please verify the ticket ID and try again."
                type="error"
                showIcon
                className="mb-4"
              />
            </div>
          ) : (
            <TicketDetail
              bookingData={bookingData?.data}
              isLoading={isLoadingBooking || isCheckinLoading}
              checkinStatus={checkinStatus}
              errorType={errorType}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default CheckinLayout;
