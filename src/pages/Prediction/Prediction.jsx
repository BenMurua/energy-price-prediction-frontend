// src/pages/Prediction/Prediction.jsx

import { useState } from "react";
import "./Prediction.css";
import DailyChart from "../../components/DailyChart/DailyChart";
import useMultipleEnergyData from "../../hooks/useMultipleEnergyData";
import { useTranslation } from "react-i18next";
import energyConfig from "../../config/energyQueries.json";
import SelectSystemDuration from "../../components/SelectSystemDuration/SelectSystemDuration";

const Prediction = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);
  const dayAfterTomorrow = new Date(tomorrow);
  dayAfterTomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrowStr = dayAfterTomorrow.toISOString().slice(0, 10);

  const [apiRange, setApiRange] = useState({
    fecha_inicio: `${tomorrowStr} 00:00:00`,
    fecha_fin: `${dayAfterTomorrowStr} 00:00:00`,
  });
  const [duration, setDuration] = useState("4h"); // valor inicial
  const { t } = useTranslation();

  // Un hook para llamar a la API
  const { data, isLoading, error } = useMultipleEnergyData(
    energyConfig.queries,
    apiRange.fecha_inicio,
    apiRange.fecha_fin
  );

  // Calcular el timeframe óptimo para cargar y descargar
  const getTimeframe = (period, durationHours) => {
    const items = period?.filter((item) => item.price === true) || [];
    if (items.length === 0) return t("prediction.not_available");
    // Start from the first true item
    const startItem = items[0];
    const startHour = parseInt(startItem.hour.split(":")[0]);
    const endHour = startHour + durationHours;
    const endTime = `${String(endHour).padStart(2, "0")}:00`;
    return `${startItem.hour}-${endTime}`;
  };
  // Obtener solo el primer bloque de carga/descarga
  const getFirstBlock = (period) => {
    const items = period?.filter((item) => item.price === true) || [];
    if (items.length === 0) return [];
    const block = [];
    block.push(items[0]);
    for (let i = 1; i < items.length; i++) {
      const currentHour = parseInt(items[i].hour.split(":")[0]);
      const prevHour = parseInt(items[i - 1].hour.split(":")[0]);
      if (currentHour === prevHour + 1) {
        block.push(items[i]);
      } else {
        break;
      }
    }
    return block;
  };

  const chargePeriodFiltered = getFirstBlock(data[`charge${duration}`]);
  const dischargePeriodFiltered = getFirstBlock(data[`discharge${duration}`]);
  const bestChargeTimeframe = getTimeframe(
    data[`charge${duration}`],
    parseInt(duration)
  );
  const bestDischargeTimeframe = getTimeframe(
    data[`discharge${duration}`],
    parseInt(duration)
  );

  return (
    <div className="prediction-container">
      <div className="prediction-sidebar">
        <SelectSystemDuration value={duration} onChange={setDuration} />
        <div className="best-charge-box">
          <p
            style={{
              margin: 0,
              fontWeight: "500",
              color: "#333333",
              fontSize: "1.1rem",
              textShadow: "none",
            }}
          >
            {t("prediction.optimal_charge_timeframe")} {bestChargeTimeframe}
          </p>
          <p
            style={{
              margin: "10px 0 0 0",
              fontWeight: "500",
              color: "#333333",
              fontSize: "1.1rem",
              textShadow: "none",
            }}
          >
            {t("prediction.optimal_discharge_timeframe")}{" "}
            {bestDischargeTimeframe}
          </p>
        </div>
      </div>
      <div className="prediction-chart">
        {isLoading ? (
          <p>{t("prediction.loading")}</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <DailyChart
            data={data.price || []}
            data2={data.realPrice || []}
            chargePeriod={data[`charge${duration}`] || []}
            dischargePeriod={data[`discharge${duration}`] || []}
            data1Label={t("prediction.predictedPrice")}
            data2Label={t("prediction.realPrice")}
          />
        )}
      </div>
    </div>
  );
};

export default Prediction;
