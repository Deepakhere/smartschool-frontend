import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const useForgotPasswordEmailController = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const redirectToLogin = () => {
    navigate("/login");
  };

  return {
    t,
    redirectToLogin,
  };
};

export default useForgotPasswordEmailController;
