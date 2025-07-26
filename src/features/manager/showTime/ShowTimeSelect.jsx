import React, { useMemo } from "react";
import { Card, Typography, Divider } from "antd";
import TimeItem from "./TimeItem";
import dayjs from "dayjs";

const { Title } = Typography;

function ShowTimeSelect({ onSelectTime, selectedMovie }) {
  // Generate time slots in 15-minute intervals from 6:00 to 22:00
  const timeSlots = useMemo(() => {
    const slots = [];
    const startHour = 6; // 6:00 AM
    const endHour = 22; // 10:00 PM

    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        // Skip 22:15, 22:30, 22:45 as they're past 22:00
        if (hour === endHour && minute > 0) continue;

        const formattedHour = hour.toString().padStart(2, "0");
        const formattedMinute = minute.toString().padStart(2, "0");
        slots.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return slots;
  }, []);

  // Group times by morning, afternoon, and evening
  const morningTimes = timeSlots.filter((time) => {
    const hour = parseInt(time.split(":")[0], 10);
    return hour >= 6 && hour < 12;
  });

  const afternoonTimes = timeSlots.filter((time) => {
    const hour = parseInt(time.split(":")[0], 10);
    return hour >= 12 && hour < 18;
  });

  const eveningTimes = timeSlots.filter((time) => {
    const hour = parseInt(time.split(":")[0], 10);
    return hour >= 18 && hour <= 22;
  });

  const handleTimeSelect = (time) => {
    if (onSelectTime && selectedMovie) {
      // Convert time string to dayjs object for today
      const startTime = dayjs(`2000-01-01 ${time}`);
      onSelectTime(startTime);
    }
  };

  return (
    <Card className="mb-6">
      <Title level={5}>Popular Showtimes</Title>
      <p className="text-gray-500 mb-4">
        Click on a time to quickly add it to your showtime list
      </p>

      <div>
        <Title level={5} className="mb-2">
          Morning
        </Title>
        <div className="flex flex-wrap mb-4">
          {morningTimes.map((time) => (
            <TimeItem key={time} time={time} onSelect={handleTimeSelect} />
          ))}
        </div>

        <Divider className="my-2" />

        <Title level={5} className="mb-2">
          Afternoon
        </Title>
        <div className="flex flex-wrap mb-4">
          {afternoonTimes.map((time) => (
            <TimeItem key={time} time={time} onSelect={handleTimeSelect} />
          ))}
        </div>

        <Divider className="my-2" />

        <Title level={5} className="mb-2">
          Evening
        </Title>
        <div className="flex flex-wrap mb-4">
          {eveningTimes.map((time) => (
            <TimeItem key={time} time={time} onSelect={handleTimeSelect} />
          ))}
        </div>
      </div>
    </Card>
  );
}

export default ShowTimeSelect;
