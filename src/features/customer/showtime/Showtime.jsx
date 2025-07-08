/* eslint-disable react/prop-types */

function Showtime({ isActive, time, price }) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-[14px] px-4 py-1 h-12 rounded-md border-[1px] transition-all duration-200  ${
        isActive
          ? "group border-gray-300 bg-white hover:cursor-pointer hover:bg-red-600 hover:border-red-600 hover:text-white"
          : "bg-gray-200 border-transparent text-gray-500 hover:cursor-not-allowed"
      }`}
    >
      <span>{time}</span>
      {isActive && (
        <span className="font-semibold text-gray-400 text-[12px] group-hover:text-white transition-all duration-200">
          {price}
        </span>
      )}
    </div>
  );
}

export default Showtime;
