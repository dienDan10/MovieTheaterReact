import { useDispatch, useSelector } from "react-redux";
import ShowtimeLayout from "./showtime/ShowtimeLayout";
import OrderLayout from "./order/OrderLayout";
import { useGetShowtimeDetail } from "./useGetShowtimeDetail";
import { useEffect } from "react";
import { setSeats, setShowtimeData } from "../../../redux/bookingSlice";
import { SpinnerLarge } from "../../../components/Spinner";
import { Typography } from "antd";
const { Title } = Typography;

function EmployeeBookingLayout() {
  const { activity, selectedShowtime } = useSelector(
    (state) => state.employeeBooking
  );
  const dispatch = useDispatch();
  const {
    showtimeDetail,
    isPending: isLoadingShowtimeDetail,
    error: errorShowtimeDetail,
  } = useGetShowtimeDetail();

  useEffect(() => {
    if (showtimeDetail && showtimeDetail.seats) {
      dispatch(setSeats(showtimeDetail.seats));
      dispatch(setShowtimeData(showtimeDetail));
    }
  }, [dispatch, showtimeDetail]);

  if (isLoadingShowtimeDetail && selectedShowtime)
    return (
      <div className=" text-neutral-50 min-h-screen flex items-center justify-center">
        <SpinnerLarge />
      </div>
    );

  if (errorShowtimeDetail)
    return (
      <div className="bg-neutral-800 min-h-screen flex items-center justify-center">
        <div className="p-6 text-center bg-neutral-700 rounded-lg shadow">
          <Title level={4} style={{ color: "#ff4d4f" }}>
            Failed to load showtimes. Please try again later.
          </Title>
        </div>
      </div>
    );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Book Ticket</h1>
      {activity === "showtime" && <ShowtimeLayout />}
      {activity === "booking" && <OrderLayout />}
    </div>
  );
}

export default EmployeeBookingLayout;
