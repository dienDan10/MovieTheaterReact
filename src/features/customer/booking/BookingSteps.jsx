import { MdOutlineChair } from "react-icons/md";
import BookingStep from "../../../components/BookingStep";
import { LuPopcorn } from "react-icons/lu";
import { FaRegCreditCard } from "react-icons/fa";
import { useSelector } from "react-redux";

function BookingSteps() {
  const { step } = useSelector((state) => state.booking);
  return (
    <div className="flex flex-row">
      <BookingStep
        isActive={step === 1}
        icon={<MdOutlineChair className="text-xl" />}
        text="Chọn ghế"
      />
      <BookingStep
        isActive={step === 2}
        icon={<LuPopcorn className="text-xl" />}
        text="Chọn đồ ăn"
      />
      <BookingStep
        isActive={step === 3}
        icon={<FaRegCreditCard className="text-xl" />}
        text="Thanh toán"
      />
    </div>
  );
}

export default BookingSteps;
