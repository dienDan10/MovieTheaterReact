import { useDispatch, useSelector } from "react-redux";
import ShowtimeLayout from "./showtime/ShowtimeLayout";
import OrderLayout from "./order/OrderLayout";
import BackButton from "./BackButton";
import { useGetShowtimeDetail } from "./useGetShowtimeDetail";
import { useEffect } from "react";
import {
  resetBookingState,
  setSeats,
  setShowtimeData,
} from "../../../redux/bookingSlice";
import { SpinnerLarge } from "../../../components/Spinner";
import { Typography } from "antd";
import {
  resetActivity,
  setPaymentDetails,
} from "../../../redux/employeeBookingSlice";
import TicketDetail from "./ticket-detail/TicketDetail";
import { useGetBookingDetail } from "../../customer/booking/booking-status/useGetBookingDetail";
const { Title } = Typography;

function EmployeeBookingLayout() {
  const { activity, paymentId } = useSelector((state) => state.employeeBooking);
  const dispatch = useDispatch();
  const {
    showtimeDetail,
    isLoading: isLoadingShowtimeDetail,
    error: errorShowtimeDetail,
  } = useGetShowtimeDetail();

  // Get booking details query
  const {
    data: bookingDetails,
    isLoading: isLoadingDetails,
    error: bookingDetailsError,
  } = useGetBookingDetail(paymentId);

  useEffect(() => {
    if (showtimeDetail && showtimeDetail.seats) {
      dispatch(setSeats(showtimeDetail.seats));
      dispatch(setShowtimeData(showtimeDetail));
    }
  }, [dispatch, showtimeDetail]);

  useEffect(() => {
    if (bookingDetails && !isLoadingDetails) {
      dispatch(setPaymentDetails(bookingDetails.data));
    }
  }, [bookingDetails, isLoadingDetails, dispatch]);

  const handleBackBtnClick = () => {
    if (activity === "showtime") return;
    dispatch(resetActivity());
    dispatch(resetBookingState());
  };

  if (isLoadingShowtimeDetail || isLoadingDetails)
    return (
      <div className=" text-neutral-50 min-h-screen flex items-center justify-center">
        <SpinnerLarge />
      </div>
    );

  if (errorShowtimeDetail || bookingDetailsError)
    return (
      <div className="bg-neutral-800 min-h-screen flex items-center justify-center">
        <div className="p-6 text-center bg-neutral-700 rounded-lg shadow">
          <Title level={4} style={{ color: "#ff4d4f" }}>
            Failed to load data. Please try again later.
          </Title>
        </div>
      </div>
    );

  return (
    <div>
      <div className="flex items-center justify-between ">
        {activity !== "showtime" ? (
          <BackButton onClick={handleBackBtnClick} />
        ) : (
          <div></div>
        )}
        <h1 className="text-2xl font-bold mb-4">Book Ticket</h1>
        <div></div>
      </div>
      {activity === "showtime" && <ShowtimeLayout />}
      {activity === "booking" && <OrderLayout />}
      {activity === "ticket" && <TicketDetail />}
    </div>
  );
}

export default EmployeeBookingLayout;
