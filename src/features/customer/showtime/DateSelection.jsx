import DateItem from "./DateItem";

function DateSelection() {
  return (
    <div className="flex gap-2 mb-6 w-full">
      <DateItem date="7/7" weekday="Th 2" isActive={true} />
      <DateItem date="8/7" weekday="Th 3" isActive={false} />
      <DateItem date="9/7" weekday="Th 4" isActive={false} />
      <DateItem date="10/7" weekday="Th 5" isActive={false} />
      <DateItem date="11/7" weekday="Th 6" isActive={false} />
    </div>
  );
}

export default DateSelection;
