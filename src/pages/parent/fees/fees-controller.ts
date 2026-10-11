import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useGetMyFees } from "@/pages/admin/fees/service/fees-service";

const useParentFeesController = () => {
  const { t } = useTranslation();
  const { organizationId } = useParams();

  const getMyFees = useGetMyFees(organizationId || "");
  const fees = getMyFees.data?.items || [];

  return {
    t,
    fees,
    isLoading: getMyFees.isLoading,
    // a failed load shows an error with a retry, not an empty page
    loadError: getMyFees.isError ? getMyFees.error : null,
    retryLoad: () => getMyFees.refetch(),
  };
};

export default useParentFeesController;
