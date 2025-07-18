import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../../../../redux/employeeBookingSlice";
import DateItem from "../../../customer/showtime/DateItem";

function DateSelection() {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.employeeBooking);
  const [dates, setDates] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Generate 5 days starting from today
  useEffect(() => {
    const generateDates = () => {
      const result = [];
      const weekdays = ["CN", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"];

      for (let i = 0; i < 5; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);

        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;
        const weekday = weekdays[date.getDay()];
        const isoDate = date.toISOString().split("T")[0]; // YYYY-MM-DD format

        result.push({
          displayDate: formattedDate,
          weekday: weekday,
          fullDate: isoDate,
        });
      }

      return result;
    };

    const datesList = generateDates();
    setDates(datesList);
  }, []);

  // Update selectedIndex whenever Redux filters.date changes
  useEffect(() => {
    if (filters.date && dates.length > 0) {
      const index = dates.findIndex((d) => d.fullDate === filters.date);
      if (index !== -1) {
        setSelectedIndex(index);
      }
    }
  }, [filters.date, dates]);

  const handleDateSelect = (index) => {
    //setSelectedIndex(index);
    dispatch(setFilters({ date: dates[index].fullDate }));
  };

  return (
    <div className="flex gap-2 mb-6 w-full">
      {dates.map((date, index) => (
        <DateItem
          key={index}
          date={date.displayDate}
          weekday={date.weekday}
          isActive={index === selectedIndex}
          onClick={() => handleDateSelect(index)}
        />
      ))}
    </div>
  );
}

export default DateSelection;
