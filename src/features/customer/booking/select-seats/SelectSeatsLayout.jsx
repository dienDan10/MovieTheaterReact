import SeatDescription from "./SeatDescription";
import SeatGrid from "./SeatGrid";
import SeatRows from "./SeatRows";

function SelectSeatsLayout() {
  return (
    <div className="flex-[2] flex flex-col gap-2 items-center">
      <SeatDescription />
      <div className="w-full mb-4 relative">
        <div className="h-8 bg-neutral-50 flex items-center justify-center shadow-md ml-8">
          <div className="text-center font-medium text-gray-800">SCREEN</div>
        </div>
      </div>
      <div className="flex flex-row w-full">
        <SeatRows />
        <SeatGrid />
      </div>
    </div>
  );
}

export default SelectSeatsLayout;
