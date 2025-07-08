import { useSelector } from "react-redux";
import BookingSteps from "./BookingSteps";
import SelectSeatsLayout from "./select-seats/SelectSeatsLayout";
import SelectConcessionLayout from "./select-concessions/SelectConcessionLayout";
import PaymentLayout from "./payment/PaymentLayout";
import BookingDetails from "./BookingDetails";

function BookingLayout() {
  const { step } = useSelector((state) => state.booking);
  return (
    <div className="bg-neutral-800 text-neutral-50 min-h-screen">
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

export default BookingLayout;
