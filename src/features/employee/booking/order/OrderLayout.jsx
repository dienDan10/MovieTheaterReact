import { useSelector } from "react-redux";
import BookingDetails from "../../../customer/booking/BookingDetails";
import BookingSteps from "../../../customer/booking/BookingSteps";
import PaymentLayout from "../../../customer/booking/payment/PaymentLayout";
import SelectConcessionLayout from "../../../customer/booking/select-concessions/SelectConcessionLayout";
import SelectSeatsLayout from "../../../customer/booking/select-seats/SelectSeatsLayout";

function OrderLayout() {
  const { step } = useSelector((state) => state.booking);

  return (
    <div className="text-neutral-50 min-h-screen">
      <div className="max-w-6xl mx-auto py-6 px-2 md:px-4">
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

export default OrderLayout;
