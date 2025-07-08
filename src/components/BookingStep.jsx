import { MdChair, MdOutlineChair } from "react-icons/md";

// eslint-disable-next-line react/prop-types
function BookingStep({ isActive = true, icon, text }) {
  return (
    <div
      style={{
        clipPath:
          "polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%)",
      }}
      className={` flex flex-col flex-1 items-center justify-center w-40 h-[50px] border-[2px] border-red-700  ${
        isActive ? "bg-red-700 text-neutral-50" : "bg-neutral-50 text-red-700"
      } transition-all duration-200`}
    >
      {/* <MdOutlineChair className="text-xl" /> */}
      {icon && icon}
      <span className="text-xs">{text}</span>
    </div>
  );
}

export default BookingStep;
