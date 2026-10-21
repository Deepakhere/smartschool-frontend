import { useMutation, useQueryClient } from "@tanstack/react-query";

import apiClient from "@/config";
import { IAPIError, IAxiosResponse } from "@/types";
import { APIS_ROUTES, API_QUERY_KEY } from "@/utils";
import { openRazorpayCheckout } from "@/lib/razorpay-checkout";

const base = (organizationId: string) => `${APIS_ROUTES.FEE_SERVICE}/${organizationId}/online-payment`;

interface Checkout {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  schoolName: string;
  description: string;
  prefill: { name: string; email: string; contact: string };
}

export type PayOnlineOutcome = "paid" | "needs_review" | "cancelled";

// start a checkout on the server (it sets the amount), let the parent pay, then hand the signed result back
export const usePayFeesOnline = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<PayOnlineOutcome, IAPIError | Error, { studentFeeId: string; installmentLabels?: string[] }>({
    mutationFn: async ({ studentFeeId, installmentLabels }) => {
      const started = await apiClient.post<null, IAxiosResponse<{ item: Checkout }>>(`${base(organizationId)}/checkout`, {
        studentFeeId,
        installmentLabels,
      });
      const checkout = started.data.Data.item;
      const result = await openRazorpayCheckout({
        key: checkout.keyId,
        order_id: checkout.orderId,
        amount: checkout.amount,
        currency: checkout.currency,
        name: checkout.schoolName,
        description: checkout.description,
        prefill: checkout.prefill,
        theme: { color: "#171717" },
      });
      if (!result) return "cancelled";
      const confirmed = await apiClient.post<null, IAxiosResponse<{ item: { status: PayOnlineOutcome } }>>(`${base(organizationId)}/confirm`, {
        orderId: result.razorpay_order_id,
        paymentId: result.razorpay_payment_id,
        signature: result.razorpay_signature,
      });
      return confirmed.data.Data.item.status;
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_MY_FEES, organizationId] }),
  });
};
