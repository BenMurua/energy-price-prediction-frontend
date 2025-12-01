// src/hooks/useEnergyData.js

import { useState, useEffect } from "react";

// --- CONFIGURACIÓN API ---
// Usamos ruta relativa para aprovechar la proxy de Vite en desarrollo
const API_BASE_URL = "/api/v1";

// FUNCIÓN MODULAR para llamar a la API
const fetchEnergyDataFromAPI = async (tabla, variable, fecha_inicio, fecha_fin) => {
  try {
    const response = await fetch(`${API_BASE_URL}/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tabla,
        variable,
        fecha_inicio,
        fecha_fin,
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data from API:", error);
    throw error;
  }
};

export default function useEnergyData(options = {}) {
  const [data, setData] = useState([]);
  const [chargePeriod, setChargePeriod] = useState(null);
  const [dischargePeriod, setDischargePeriod] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { tabla, variable, fecha_inicio, fecha_fin } = options;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!tabla || !variable || !fecha_inicio || !fecha_fin) {
          throw new Error("Se requieren todos los parámetros: tabla, variable, fecha_inicio, fecha_fin");
        }

        const apiResponse = await fetchEnergyDataFromAPI(tabla, variable, fecha_inicio, fecha_fin);

        // Normalizar respuesta: si viene como { prices: [...] } usamos prices, si viene directo como array usamos ese
        const items = Array.isArray(apiResponse) ? apiResponse : apiResponse?.prices || [];

        const pad = (n) => String(n).padStart(2, "0");
        const mapped = items.map((it) => {
          const dt = new Date(it.datetime);
          const hour = `${pad(dt.getHours())}:${pad(dt.getMinutes())}`;
          const price = it[variable] != null ? Math.round(Number(it[variable])) : null;
          return { hour, price };
        });

        setData(mapped);
        // Si la API proporciona periodos, los asignamos; si no, quedan null
        setChargePeriod(apiResponse?.optimalCharge || null);
        setDischargePeriod(apiResponse?.optimalDischarge || null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching energy data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tabla, variable, fecha_inicio, fecha_fin]);

  return { data, chargePeriod, dischargePeriod, isLoading, error };
}