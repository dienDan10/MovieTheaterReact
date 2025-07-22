import { useState, useCallback } from "react";
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
import QrScanner from "./QrScanner";

function CheckinLayout() {
  const [paymentId, setPaymentId] = useState(null);
  const [checkinStatus, setCheckinStatus] = useState("Not Checked In");
  const [showTicketDetail, setShowTicketDetail] = useState(false);
  const [errorType, setErrorType] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
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

  // Toggle scanner visibility
  const toggleScanner = useCallback(() => {
    setShowScanner((prevState) => !prevState);
  }, []);

  // Handle check-in process
  const handleCheckin = useCallback(
    (input) => {
      // Nếu input là mã vé CineMax_Ticket_{paymentId}_{datetime}, tách paymentId
      let ticketId = input;
      if (typeof input === "string" && input.startsWith("CineMax_Ticket_")) {
        const parts = input.split("_");
        if (parts.length >= 3 && !isNaN(parts[2])) {
          ticketId = parts[2];
        } else {
          dispatch(
            notify({
              type: ERROR_NOTIFICATION,
              message: "Invalid ticket ID format from QR code",
            })
          );
          return;
        }
      }

      // Reset error states
      setErrorType(null);
      setPaymentId(ticketId);
      setShowTicketDetail(true);

      // Process the ticket check-in
      checkinTicket(ticketId, {
        onSuccess: () => {
          setCheckinStatus("Checked In");
          dispatch(
            notify({
              type: SUCCESS_NOTIFICATION,
              message: "Ticket checked in successfully!",
            })
          );
          // Keep scanner open for continuous scanning
        },
        onError: (error) => {
          setShowTicketDetail(true);
          if (error.response) {
            const { status } = error.response;
            if (status === 404) {
              setErrorType("NOT_FOUND");
              dispatch(
                notify({
                  type: ERROR_NOTIFICATION,
                  message: "Ticket not found. Please verify the ticket ID.",
                })
              );
            } else if (status === 400) {
              setErrorType("ALREADY_CHECKED_IN");
              dispatch(
                notify({
                  type: ERROR_NOTIFICATION,
                  message:
                    error?.response?.data?.title ||
                    "This ticket has already been checked in.",
                })
              );
            } else {
              setErrorType("GENERAL_ERROR");
              dispatch(
                notify({
                  type: ERROR_NOTIFICATION,
                  message: error?.message || "Failed to check in ticket",
                })
              );
            }
          } else {
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
    },
    [checkinTicket, dispatch]
  );

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
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Check-in actions */}
        <div className="md:w-1/2 w-full space-y-6">
          <SearchTicketForm onCheckin={handleCheckin} />
          <div className="flex justify-center items-center">
            {!showScanner ? (
              <button
                onClick={toggleScanner}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition w-full max-w-md"
              >
                Scan QR Code
              </button>
            ) : (
              <QrScanner onScan={handleCheckin} onClose={toggleScanner} />
            )}
          </div>
        </div>
        {/* Right: Ticket detail */}
        <div className="md:w-1/2 w-full">
          {showTicketDetail ? (
            <>
              <button
                onClick={() => {
                  setShowTicketDetail(false);
                  setPaymentId(null);
                  setCheckinStatus("Not Checked In");
                  setErrorType(null);
                }}
                className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition w-full"
              >
                Clear Ticket Info
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
            </>
          ) : (
            <div className="text-gray-400 text-center mt-16">
              No ticket information available. Please check in to see ticket
              details.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CheckinLayout;
