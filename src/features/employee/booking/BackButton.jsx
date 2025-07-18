import { FaArrowLeft } from "react-icons/fa";

function BackButton({ onClick }) {
  return (
    <div
      onClick={() => onClick?.()}
      className="px-2 py-2 border-2 border-gray-950 rounded-full inline-block cursor-pointer hover:bg-gray-900 hover:text-gray-50 transition-colors"
    >
      <FaArrowLeft />
    </div>
  );
}

export default BackButton;
