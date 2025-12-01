import { useEffect, useState } from "react";
import "./header.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

import { RoutesValues } from "../../models/RoutesValues.js";

export default function Header() {
  const [theme, setTheme] = useState("light");
  const [menuOpen, setMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header>
      <a href="/" className="logo">
        {t("header.logo")}
      </a>

      <button
        className={`menu-toggle ${menuOpen ? "open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      <nav className={menuOpen ? "open" : ""}>
        {/* Usamos NavLink con la prop "to" */}
        <NavLink to={RoutesValues.precios}>{t("header.precios")}</NavLink>
        <NavLink to={RoutesValues.graficas}>{t("header.graficas")}</NavLink>
        <NavLink to={RoutesValues.contacto}>{t("header.contacto")}</NavLink>
      </nav>

      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === "light" ? t("header.theme.light") : t("header.theme.dark")}
      </button>

      <select
        className="lang-select"
        value={i18n.language}
        onChange={(e) => changeLanguage(e.target.value)}
      >
        <option value="es">ES</option>
        <option value="en">EN</option>
        <option value="eus">EUS</option>
      </select>
    </header>
  );
}
