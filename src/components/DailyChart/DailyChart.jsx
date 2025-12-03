// src/components/DailyChart/DailyChart.js

import "./DailyChart.css";
import { useTranslation } from "react-i18next";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";

export default function DailyChart({ data, chargePeriod, dischargePeriod }) {
  const { t } = useTranslation();

  return (
    <div style={{ width: "100%", maxWidth: 800, margin: "0 auto" }}>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis domain={["auto", "auto"]} unit="€" />
          <Tooltip />

          {chargePeriod && (
            <ReferenceArea
              x1={chargePeriod.start}
              x2={chargePeriod.end}
              fill="#4CAF50"
              fillOpacity={0.2}
              label="Carga"
            />
          )}

          {dischargePeriod && (
            <ReferenceArea
              x1={dischargePeriod.start}
              x2={dischargePeriod.end}
              fill="#F44336"
              fillOpacity={0.2}
              label="Descarga"
            />
          )}

          <Line
            type="monotone"
            dataKey="price"
            stroke="#4CAF50"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
