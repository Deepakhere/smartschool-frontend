import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

import { useGetMyFees } from "@/pages/admin/fees/service/fees-service";
import { IAPIError } from "@/types";
import { usePayFeesOnline } from "./online-payment-service";

const useParentFeesController = () => {
  const { t } = useTranslation();
  const { organizationId } = useParams();

  const getMyFees = useGetMyFees(organizationId || "");
  const fees = getMyFees.data?.items || [];
  const payFeesOnline = usePayFeesOnline(organizationId || "");

  const payOnline = (studentFeeId: string, installmentLabels?: string[]) =>
    payFeesOnline.mutate(
      { studentFeeId, installmentLabels },
      {
        onSuccess: (outcome) => {
          if (outcome === "paid") toast.success("Payment received. Your receipt is ready below.");
          else if (outcome === "needs_review") toast("Payment received. The school will apply it shortly.");
          else if (outcome === "pending") toast("Payment received. We're confirming it, and your receipt will appear here shortly.");
        },
        onError: (error) =>
          toast.error((error as IAPIError)?.response?.Error?.message || (error as Error)?.message || "The payment didn't go through."),
      }
    );

  return {
    t,
    fees,
    canPayOnline: Boolean(getMyFees.data?.onlinePaymentsEnabled),
    payOnline,
    // which fee (and instalment) is being paid right now, for its button's spinner
    paying: payFeesOnline.isPending ? payFeesOnline.variables : null,
    isLoading: getMyFees.isLoading,
    // a failed load shows an error with a retry, not an empty page
    loadError: getMyFees.isError ? getMyFees.error : null,
    retryLoad: () => getMyFees.refetch(),
  };
};

export default useParentFeesController;
