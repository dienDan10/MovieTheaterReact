function DateItem({ date, weekday, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-4 py-3 rounded-lg text-center min-w-20 ${
        isActive ? "bg-red-600 text-white" : "bg-gray-200 text-gray-600"
      } transition-colors duration-200 hover:bg-red-600 hover:text-white hover:cursor-pointer`}
    >
      <div className="text-sm">{date}</div>
      <div className="text-xs">{weekday}</div>
    </button>
  );
}

export default DateItem;
