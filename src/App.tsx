import { useTranslation } from "react-i18next";
import Logo from "./icons/logo";

function App() {
  const { t } = useTranslation();
  return (
    <>
      <div className="text-5xl font-bold underline">
        {t("labels.welcome")} <Logo />{" "}
      </div>
    </>
  );
}

export default App;
