import { useTranslation } from "react-i18next";
import "./footer.css";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer>
      <p>{t("footer.copyright")}</p>
    </footer>
  );
}
