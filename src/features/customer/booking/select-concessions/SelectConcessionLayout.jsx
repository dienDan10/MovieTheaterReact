import ConcessionItem from "./ConcessionItem";
import { useSelector } from "react-redux";

function SelectConcessionLayout() {
  const { concessions } = useSelector((state) => state.booking);

  if (!concessions || concessions.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex-[2]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 flex-2">COMBO</h2>
        <div className="flex space-x-8 flex-1 justify-around">
          <span className="text-sm font-medium text-gray-600">GIÁ TIỀN</span>
          <span className="text-sm font-medium text-gray-600">SỐ LƯỢNG</span>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-6">
        {concessions.map((concession) => (
          <ConcessionItem key={concession.id} item={concession} />
        ))}
      </div>
    </div>
  );
}

export default SelectConcessionLayout;
