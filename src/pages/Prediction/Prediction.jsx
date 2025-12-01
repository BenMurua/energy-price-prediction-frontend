// src/pages/Home/Home.js

import { useState, useMemo } from "react";
import "./Prediction.css";
import DailyChart from "../../components/DailyChart/DailyChart";
import useEnergyData from "../../hooks/getEnergyData"; // 1. Importar nuestro nuevo hook
import { useTranslation } from "react-i18next";

const Home = () => {
  // El único estado que maneja 'Home' es la opción seleccionada
  const [duration, setDuration] = useState(2);
  const { t } = useTranslation();

  // 2. Usamos el hook para obtener datos desde la API (ahora requiere options)
  const { data, chargePeriod, dischargePeriod, isLoading, error } =
    useEnergyData({
      tabla: "V1_predicted_data",
      variable: "predicted_omie_price_eur_mw",
      fecha_inicio: "2025-11-25 00:00:00",
      fecha_fin: "2025-11-26 00:00:00",
    });

  const handleDurationChange = (e) => {
    setDuration(Number(e.target.value));
  };

  return (
    <div className="home-container">
      {isLoading ? (
        <p>{t("prediction.loading")}</p>
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
