import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./StatisticsControl.css"; // Asumiendo que crearemos un CSS

const StatisticsControl = ({ onOutputChange }) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState([false, false, false]);

  const associations = {
    1: "Processed: First text",
    2: "Processed: Second text",
    3: "Processed: Third text",
  };

  const texts = [
    t("statisticsControl.1hour"),
    t("statisticsControl.2hour"),
    t("statisticsControl.4hour"),
  ];

  // Función "biblioteca" que asigna otro texto basado en el index
  const processText = (index) => {
    return associations[index + 1] || "Unknown text";
  };

  const handleCheckboxChange = (index) => {
    const newSelected = [...selected];
    newSelected[index] = !newSelected[index];
    setSelected(newSelected);
    const selectedIndices = newSelected
      .map((s, i) => (s ? i : -1))
      .filter((i) => i !== -1);
    const processed = selectedIndices.map((i) => processText(i)).join(", ");
    if (onOutputChange) {
      onOutputChange(processed);
    }
  };

  return (
    <div className="statistics-control-container">
      <h2>{t("statisticsControl.title")}</h2>
      <div className="text-lines">
        {texts.map((text, index) => (
          <div key={index} className="text-line">
            <input
              type="checkbox"
              checked={selected[index]}
              onChange={() => handleCheckboxChange(index)}
            />
            <p>{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatisticsControl;
