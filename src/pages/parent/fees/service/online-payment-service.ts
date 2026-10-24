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

export type PayOnlineOutcome = "paid" | "needs_review" | "pending" | "cancelled";

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
      // the money is taken by now, so a confirm that fails or is still processing is pending, never an error:
      // Razorpay's webhook records it, and an error here would invite paying twice
      try {
        const confirmed = await apiClient.post<null, IAxiosResponse<{ item: { status: string } }>>(`${base(organizationId)}/confirm`, {
          orderId: result.razorpay_order_id,
          paymentId: result.razorpay_payment_id,
          signature: result.razorpay_signature,
        });
        const status = confirmed.data.Data.item.status;
        return status === "paid" || status === "needs_review" ? status : "pending";
      } catch {
        return "pending";
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_MY_FEES, organizationId] }),
  });
};
