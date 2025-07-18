import { useSelector } from "react-redux";
import { ROLE_EMPLOYEE } from "../../../../utils/constant";

function SeatDescription() {
  const { user } = useSelector((state) => state.user);
  return (
    <div
      className={`flex justify-center gap-8 mt-4 mb-2 ${
        user.role === ROLE_EMPLOYEE && "text-neutral-900"
      }`}
    >
      <div className="flex items-center">
        <div className="w-6 h-6 bg-green-500 rounded mr-2 shadow-[0_0_11px_rgba(0,179,0,1)]"></div>
        <span>Ghế bạn chọn</span>
      </div>
      <div className="flex items-center">
        <div className="w-6 h-6 bg-repeating-stripe rounded mr-2"></div>
        <span>Đã bán</span>
      </div>
      <div className="flex items-center">
        <div className="w-6 h-6 bg-red-500 rounded mr-2"></div>
        <span>Có thể chọn</span>
      </div>
    </div>
  );
}

export default SeatDescription;
