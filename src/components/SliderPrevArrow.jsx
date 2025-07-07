// eslint-disable-next-line react/prop-types
function SliderPrevArrow({ style, onClick }) {
  return (
    <div
      className="absolute left-4 top-1/2 z-5 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/50 text-white hover:bg-white/70 hover:text-gray-900 transition-all"
      style={style}
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-6 w-6 mt-2 ms-1.5"
      >
        <path
          fillRule="evenodd"
          d="M7.72 12.53a.75.75 0 010-1.06l7.5-7.5a.75.75 0 111.06 1.06L9.31 12l6.97 6.97a.75.75 0 11-1.06 1.06l-7.5-7.5z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}

export default SliderPrevArrow;
