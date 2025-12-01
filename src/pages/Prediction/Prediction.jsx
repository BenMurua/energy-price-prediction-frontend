// src/pages/Home/Home.js

import { useState } from "react";
import "./Prediction.css";
import DailyChart from "../../components/DailyChart/DailyChart";
import useEnergyData from "../../hooks/getEnergyData"; // 1. Importar nuestro nuevo hook
import { useTranslation } from "react-i18next";
import DateSelector from "../../components/DateSelector/DateSelector";

const Home = () => {
  // Estado para el rango que se enviará a la API (simplificado: hoy 00:00 -> mañana 00:00)
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10); // YYYY-MM-DD
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  const [apiRange, setApiRange] = useState({
    fecha_inicio: `${todayStr} 00:00:00`,
    fecha_fin: `${tomorrowStr} 00:00:00`,
  });
  const { t } = useTranslation();

  // 2. Usamos el hook para obtener datos desde la API (ahora con fechas dinámicas)
  const { data, chargePeriod, dischargePeriod, isLoading, error } =
    useEnergyData({
      tabla: "V1_predicted_data",
      variable: "predicted_omie_price_eur_mw",
      fecha_inicio: apiRange.fecha_inicio,
      fecha_fin: apiRange.fecha_fin,
    });

  const handleRangeChange = (range) => {
    if (
      range.fecha_inicio !== apiRange.fecha_inicio ||
      range.fecha_fin !== apiRange.fecha_fin
    ) {
      setApiRange(range);
    }
  };

  return (
    <div className="home-container">
      <DateSelector
        onChange={handleRangeChange}
        initialDate={apiRange.fecha_inicio.slice(0, 10)}
      />

      {isLoading ? (
        <p>{t("home.loading")}</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <DailyChart
          data={data}
          chargePeriod={chargePeriod}
          dischargePeriod={dischargePeriod}
        />
      )}
    </div>
  );
};

export default Home;
