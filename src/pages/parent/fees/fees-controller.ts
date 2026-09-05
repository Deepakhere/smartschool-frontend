import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useGetMyFees } from "../../admin/fees/service/fees-service";

const useParentFeesController = () => {
  const { t } = useTranslation();
  const { organizationId } = useParams();

  const getMyFees = useGetMyFees(organizationId || "");
  const fees = getMyFees.data?.items || [];

  return {
    t,
    fees,
    isLoading: getMyFees.isLoading,
  };
};

export default useParentFeesController;
