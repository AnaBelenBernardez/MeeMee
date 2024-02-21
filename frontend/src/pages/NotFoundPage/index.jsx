import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ArrowButton from "../../components/ArrowButton";
import "./style.css";

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <main className="not-found-main">
      <div className="not-found">
        <h1 className="errorfour">404</h1>
        <h2 className="pagenotfound">{t("notFound.pageNotFound")}</h2>
        <h3 className="go-back">{t("notFound.goBackToMeeMee")}</h3>
        <Link to="/">
          <ArrowButton />
        </Link>
      </div>
    </main>
  );
};

export default NotFoundPage;
