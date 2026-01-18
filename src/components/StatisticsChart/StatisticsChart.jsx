// src/components/StatisticsChart/StatisticsChart.jsx

import React from "react";
import "./StatisticsChart.css";
import { useTranslation } from "react-i18next";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function StatisticsChart({
  data,
  data2,
  data1Label = "Ideal Return",
  data2Label = "Model Prediction Return",
}) {
  const { t } = useTranslation();

  // Merge data and data2 into a single array for the chart
  const mergedData = data
    ? data.map((item, index) => ({
        ...item,
        price2: data2 && data2[index] ? data2[index].price : null,
      }))
    : [];

  const maxLabels = 10;
  const interval =
    mergedData.length > maxLabels
      ? Math.floor(mergedData.length / maxLabels)
      : 0;

  // Altura responsiva según el ancho de pantalla
  const getChartHeight = () => {
    if (typeof window !== "undefined") {
      return window.innerWidth <= 480
        ? 280
        : window.innerWidth <= 768
          ? 350
          : 500;
    }
    return 500;
  };

  const [chartHeight, setChartHeight] = React.useState(getChartHeight());

  React.useEffect(() => {
    const handleResize = () => setChartHeight(getChartHeight());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={chartHeight}>
        <LineChart data={mergedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" interval={interval} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#8884d8"
            name={data1Label}
            strokeWidth={2}
          />
          {data2 && data2.length > 0 && (
            <Line
              type="monotone"
              dataKey="price2"
              stroke="#82ca9d"
              name={data2Label}
              strokeWidth={2}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
