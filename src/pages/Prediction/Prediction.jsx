// src/pages/Prediction/Prediction.jsx

import { useState } from "react";
import "./Prediction.css";
import DailyChart from "../../components/DailyChart/DailyChart";
import useMultipleEnergyData from "../../hooks/useMultipleEnergyData";
import { useTranslation } from "react-i18next";
import DateSelector from "../../components/DateSelector/DateSelector";
import energyConfig from "../../config/energyQueries.json";
import SelectSystemDuration from "../../components/SelectSystemDuration/SelectSystemDuration";

const Prediction = () => {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  const [apiRange, setApiRange] = useState({
    fecha_inicio: `${todayStr} 00:00:00`,
    fecha_fin: `${tomorrowStr} 00:00:00`,
  });
  const [duration, setDuration] = useState("2h"); // valor inicial
  const { t } = useTranslation();

  // Un hook para llamar a la API
  const { data, isLoading, error } = useMultipleEnergyData(
    energyConfig.queries,
    apiRange.fecha_inicio,
    apiRange.fecha_fin
  );

  const handleRangeChange = (range) => {
    if (
      range.fecha_inicio !== apiRange.fecha_inicio ||
      range.fecha_fin !== apiRange.fecha_fin
    ) {
      setApiRange(range);
    }
  };

  return (
    <div
      className="prediction-container"
      style={{ display: "flex", flexDirection: "row" }}
    >
      <SelectSystemDuration value={duration} onChange={setDuration} />
      <div style={{ flex: 1 }}>
        <DateSelector
          onChange={handleRangeChange}
          initialDate={apiRange.fecha_inicio.slice(0, 10)}
        />

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
