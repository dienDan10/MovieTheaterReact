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

function RevenueChart({ revenue }) {
  const revenueByDate = revenue.reduce((acc, curr) => {
    const dateObj = new Date(curr.date);
    const formattedDate = dateObj
      .toLocaleDateString("en-GB") // dd/mm/yyyy
      .split("/")
      .join("-"); // convert to dd-mm-yyyy
    const amount = curr.payment.amount;

    if (!acc[formattedDate]) {
      acc[formattedDate] = 0;
    }

    acc[formattedDate] += amount;
    return acc;
  }, {});

  const data = Object.entries(revenueByDate).map(([date, revenue]) => ({
    date,
    Revenue: revenue,
  }));

  return (
    <div className="w-full h-96 ">
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
          <XAxis dataKey="date" />
          <YAxis tickFormatter={(value) => value.toLocaleString("vi-VN")} />
          <Tooltip
            formatter={(values) => {
              return [`${values.toLocaleString("vi-VN")} đ`, "Revenue"];
            }}
          />
          <Legend />
          <Bar
            dataKey="Revenue"
            fill="oklch(74.6% 0.16 232.661)"
            activeBar={
              <Rectangle fill="oklch(78.9% 0.154 211.53)" stroke="blue" />
            }
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RevenueChart;
