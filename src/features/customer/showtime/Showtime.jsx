import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { notify } from "../../../redux/notificationSlice";
import { WARNING_NOTIFICATION } from "../../../utils/constant";
import { openLoginModal } from "../../../redux/showtimeSlice";

function Showtime({ isActive, time, price, id }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleClick = () => {
    if (isActive && isAuthenticated) {
      navigate(`/booking/${id}`);
      return;
    }

    if (!isAuthenticated && isActive) {
      dispatch(
        notify({
          type: WARNING_NOTIFICATION,
          message: "Please login to book a ticket",
        })
      );
      dispatch(openLoginModal(id));
      return;
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex flex-col items-center justify-center text-[14px] px-4 py-1 h-12 rounded-md border-[1px] transition-all duration-200  ${
        isActive
          ? "group border-gray-300 bg-white hover:cursor-pointer hover:bg-red-600 hover:border-red-600 hover:text-white"
          : "bg-gray-200 border-transparent text-gray-500 hover:cursor-not-allowed"
      }`}
    >
      <span>{time.substring(0, 5)}</span>
      {isActive && (
        <span className="font-semibold text-gray-400 text-[12px] group-hover:text-white transition-all duration-200">
          {price}
        </span>
      )}
    </div>
  );
}

export default Showtime;
