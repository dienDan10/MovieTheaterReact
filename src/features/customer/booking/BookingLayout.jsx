import { useDispatch, useSelector } from "react-redux";
import BookingSteps from "./BookingSteps";
import SelectSeatsLayout from "./select-seats/SelectSeatsLayout";
import SelectConcessionLayout from "./select-concessions/SelectConcessionLayout";
import PaymentLayout from "./payment/PaymentLayout";
import BookingDetails from "./BookingDetails";
import { SpinnerLarge } from "../../../components/Spinner";
import { useGetShowtimeDetail } from "./useGetShowtimeDetail";
import { useEffect } from "react";
import { setSeats, setShowtimeData } from "../../../redux/bookingSlice";
import { Typography } from "antd";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const { Title } = Typography;

function BookingLayout() {
  const {
    showtimeDetail,
    isLoading: isLoadingShowtimeDetail,
    error: errorShowtimeDetail,
  } = useGetShowtimeDetail();
  const { step } = useSelector((state) => state.booking);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (showtimeDetail && showtimeDetail.seats) {
      dispatch(setSeats(showtimeDetail.seats));
      dispatch(setShowtimeData(showtimeDetail));
    }
  }, [dispatch, showtimeDetail]);

  if (isLoadingShowtimeDetail)
    return (
      <div className="bg-neutral-800 text-neutral-50 min-h-screen flex items-center justify-center">
        <SpinnerLarge />
      </div>
    );

  if (errorShowtimeDetail || !showtimeDetail)
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
    <div className="bg-neutral-800 text-neutral-50 min-h-screen">
      <div className="max-w-6xl mx-auto py-6 px-2 md:px-4">
        <div
          onClick={() => navigate(-1)}
          className="px-2 py-2 mb-6 border-2 border-neutral-50 rounded-full inline-block cursor-pointer hover:bg-red-600 hover:border-red-600 hover:text-neutral-50 transition-colors"
        >
          <FaArrowLeft />
        </div>
        <BookingSteps />
        <div className="mt-5 flex flex-col lg:flex-row gap-6">
          {step === 1 && <SelectSeatsLayout />}
          {step === 2 && <SelectConcessionLayout />}
          {step === 3 && <PaymentLayout />}
          <BookingDetails />
        </div>
      </div>
    </div>
  );
}

export default BookingLayout;
