import { useSelector } from "react-redux";
import BackButton from "./BackButton";
import ShowtimeLayout from "./showtime/ShowtimeLayout";
import OrderLayout from "./order/OrderLayout";

function EmployeeBookingLayout() {
  const { activity } = useSelector((state) => state.employeeBooking);
  return (
    <div>
      {activity === "showtime" && <ShowtimeLayout />}
      {activity === "booking" && <OrderLayout />}
    </div>
  );
}

export default EmployeeBookingLayout;
