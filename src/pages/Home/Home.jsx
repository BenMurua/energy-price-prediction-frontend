// src/pages/Home/Home.js

import "./Home.css";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="home-hero">
      <div className="overlay" />
      <div className="hero-content">
        <h1>{t("home.title")}</h1>
        <p className="tagline">{t("home.tagline")}</p>

        <p className="description">{t("home.description")}</p>

        <ul className="features">
          <li>{t("home.feature_1")}</li>
          <li>{t("home.feature_2")}</li>
          <li>{t("home.feature_3")}</li>
        </ul>

        <div className="cta-row">
          <a className="btn primary" href="/home">
            {t("home.cta_explore")}
          </a>
          <a className="btn secondary" href="/about">
            {t("home.cta_about")}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
