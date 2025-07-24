import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Typography } from "antd";
const { Title } = Typography;

function RevenueByTimeChart({ revenue }) {
  const timeRanges = [
    { label: "06:00–08:00", start: 6, end: 8 },
    { label: "08:00–10:00", start: 8, end: 10 },
    { label: "10:00–12:00", start: 10, end: 12 },
    { label: "12:00–14:00", start: 12, end: 14 },
    { label: "14:00–16:00", start: 14, end: 16 },
    { label: "16:00–18:00", start: 16, end: 18 },
    { label: "18:00–20:00", start: 18, end: 20 },
    { label: "20:00–22:00", start: 20, end: 22 },
    { label: "22:00–24:00", start: 22, end: 24 },
  ];

  // Initialize output
  const revenueByTime = {};
  timeRanges.forEach(({ label }) => {
    revenueByTime[label] = 0;
  });

  revenue.forEach(({ payment, showTime }) => {
    const hour = parseInt(showTime.startTime.split(":")[0], 10);

    const matchingRange = timeRanges.find(
      ({ start, end }) => hour >= start && hour < end
    );

    if (matchingRange) {
      revenueByTime[matchingRange.label] += payment.amount;
    }
  });

  const data = timeRanges.map(({ label }) => ({
    timeRange: label,
    Revenue: revenueByTime[label],
  }));

  console.log("Revenue by time data:", data);

  return (
    <div className="w-full h-96 mt-5 mb-10">
      <Title level={4} className="mb-4">
        Doanh thu theo khung giờ
      </Title>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timeRange" />
          <YAxis tickFormatter={(value) => value.toLocaleString("vi-VN")} />
          <Tooltip
            formatter={(values) => {
              return [`${values.toLocaleString("vi-VN")} đ`, "Revenue"];
            }}
          />
          <Legend />
          <Bar
            dataKey="Revenue"
            fill="oklch(59.1% 0.293 322.896)"
            activeBar={
              <Rectangle fill="oklch(66.7% 0.295 322.15)" stroke="purple" />
            }
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RevenueByTimeChart;
