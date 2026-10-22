import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import apiClient from "@/config";
import { IAPIError, IAxiosResponse, IFeeHead, IFeeStructure, IStudentFeeSummary, IPayment, IFeeDefaultersResult, IFeeCollectionSummary } from "@/types";
import { APIS_ROUTES, API_QUERY_KEY, API_MUTATION_KEY } from "@/utils";
import { useIdempotencyKey } from "@/hooks";

const base = (organizationId: string) => `${APIS_ROUTES.FEE_SERVICE}/${organizationId}`;

export const useGetFeeHeads = (organizationId: string) =>
  useQuery<{ items: IFeeHead[] }, IAPIError>({
    queryKey: [API_QUERY_KEY.GET_FEE_HEADS, organizationId],
    queryFn: async () => {
      const result = await apiClient.get<null, IAxiosResponse<{ items: IFeeHead[] }>>(
        `${base(organizationId)}/fee-head`
      );
      return result.data.Data;
    },
    enabled: !!organizationId,
  });

export const useCreateFeeHead = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, { name: string; code: string; category: string; isRefundable: boolean }>({
    mutationKey: [API_MUTATION_KEY.CREATE_FEE_HEAD],
    mutationFn: async (value) => {
      await apiClient.post(`${base(organizationId)}/fee-head`, value);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_FEE_HEADS, organizationId] }),
  });
};

export const useGetFeeStructures = (organizationId: string) =>
  useQuery<{ items: IFeeStructure[] }, IAPIError>({
    queryKey: [API_QUERY_KEY.GET_FEE_STRUCTURES, organizationId],
    queryFn: async () => {
      const result = await apiClient.get<null, IAxiosResponse<{ items: IFeeStructure[] }>>(
        `${base(organizationId)}/fee-structure`
      );
      return result.data.Data;
    },
    enabled: !!organizationId,
  });

interface ICreateFeeStructurePayload {
  academicYearId: string;
  name: string;
  classIds: string[];
  sectionIds: string[];
  items: { feeHeadId: string; amount: number }[];
  installments: { label: string; dueDate: string; amount: number }[];
  lateFee: { amount: number; graceDays: number };
}

export const useCreateFeeStructure = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, ICreateFeeStructurePayload>({
    mutationKey: [API_MUTATION_KEY.CREATE_FEE_STRUCTURE],
    mutationFn: async (value) => {
      await apiClient.post(`${base(organizationId)}/fee-structure`, value);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_FEE_STRUCTURES, organizationId] }),
  });
};

export const useAssignFeeStructure = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<{ assigned_count: number; skipped_count: number }, IAPIError, string>({
    mutationKey: [API_MUTATION_KEY.ASSIGN_FEE_STRUCTURE],
    mutationFn: async (feeStructureId) => {
      const result = await apiClient.post<null, IAxiosResponse<{ assigned_count: number; skipped_count: number }>>(
        `${base(organizationId)}/fee-structure/${feeStructureId}/assign`
      );
      return result.data.Data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_STUDENT_FEE_SUMMARY, organizationId] });
      queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_FEE_STRUCTURES, organizationId] });
      queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_FEE_DEFAULTERS, organizationId] });
    },
  });
};

export interface FeeStructureUpdateResult {
  newVersion: boolean;
  moved_count: number;
  kept_count: number;
}

export const useUpdateFeeStructure = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    FeeStructureUpdateResult,
    IAPIError,
    { feeStructureId: string; value: Omit<ICreateFeeStructurePayload, "academicYearId"> & { applyToUnpaid: boolean } }
  >({
    mutationKey: [API_MUTATION_KEY.UPDATE_FEE_STRUCTURE],
    mutationFn: async ({ feeStructureId, value }) => {
      const result = await apiClient.put<null, IAxiosResponse<FeeStructureUpdateResult>>(
        `${base(organizationId)}/fee-structure/${feeStructureId}`,
        value
      );
      return result.data.Data;
    },
    onSuccess: () => {
      for (const key of [API_QUERY_KEY.GET_FEE_STRUCTURES, API_QUERY_KEY.GET_STUDENT_FEE_SUMMARY, API_QUERY_KEY.GET_FEE_DEFAULTERS]) {
        queryClient.invalidateQueries({ queryKey: [key, organizationId] });
      }
    },
  });
};

export const useUpdateFeeHead = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, { feeHeadId: string; value: { name: string; category: string; isRefundable: boolean } }>({
    mutationKey: [API_MUTATION_KEY.UPDATE_FEE_HEAD],
    mutationFn: async ({ feeHeadId, value }) => {
      await apiClient.patch(`${base(organizationId)}/fee-head/${feeHeadId}`, value);
    },
    // structures show each head's name, so they refresh too
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_FEE_HEADS, organizationId] });
      queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_FEE_STRUCTURES, organizationId] });
    },
  });
};

export const useDeactivateFeeHead = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, string>({
    mutationKey: [API_MUTATION_KEY.DEACTIVATE_FEE_HEAD],
    mutationFn: async (feeHeadId) => {
      await apiClient.delete(`${base(organizationId)}/fee-head/${feeHeadId}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_FEE_HEADS, organizationId] }),
  });
};

export const useGetStudentFeeSummary = (organizationId: string, studentId?: string) =>
  useQuery<{ items: IStudentFeeSummary[] }, IAPIError>({
    queryKey: [API_QUERY_KEY.GET_STUDENT_FEE_SUMMARY, organizationId, studentId],
    queryFn: async () => {
      const result = await apiClient.get<null, IAxiosResponse<{ items: IStudentFeeSummary[] }>>(
        `${base(organizationId)}/student-fee/${studentId}`
      );
      return result.data.Data;
    },
    enabled: !!organizationId && !!studentId,
  });

export const useGetMyFees = (organizationId: string) =>
  useQuery<{ items: IStudentFeeSummary[]; onlinePaymentsEnabled?: boolean }, IAPIError>({
    queryKey: [API_QUERY_KEY.GET_MY_FEES, organizationId],
    queryFn: async () => {
      const result = await apiClient.get<null, IAxiosResponse<{ items: IStudentFeeSummary[]; onlinePaymentsEnabled?: boolean }>>(
        `${base(organizationId)}/my-fees`
      );
      return result.data.Data;
    },
    enabled: !!organizationId,
  });

interface IRecordPaymentPayload {
  studentFeeId: string;
  amount: number;
  method: string;
  instrumentRef?: string;
  remarks?: string;
}

// the backend requires an Idempotency-Key on money routes; see useIdempotencyKey for when it changes
export const useRecordPayment = (organizationId: string) => {
  const queryClient = useQueryClient();
  const idempotency = useIdempotencyKey();
  return useMutation<void, IAPIError, IRecordPaymentPayload>({
    mutationKey: [API_MUTATION_KEY.RECORD_PAYMENT],
    mutationFn: async (value) => {
      await apiClient.post(`${base(organizationId)}/payment`, value, {
        headers: { "Idempotency-Key": idempotency.keyFor(value) },
      });
    },
    onSuccess: () => {
      idempotency.reset();
      queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_STUDENT_FEE_SUMMARY, organizationId] });
      queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_PAYMENT_LEDGER, organizationId] });
      queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_FEE_DEFAULTERS, organizationId] });
      queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_FEE_COLLECTIONS, organizationId] });
    },
  });
};

export const useReversePayment = (organizationId: string) => {
  const queryClient = useQueryClient();
  const idempotency = useIdempotencyKey();
  return useMutation<void, IAPIError, string>({
    mutationKey: [API_MUTATION_KEY.REVERSE_PAYMENT],
    mutationFn: async (paymentId) => {
      await apiClient.post(
        `${base(organizationId)}/payment/${paymentId}/reverse`,
        {},
        { headers: { "Idempotency-Key": idempotency.keyFor({ paymentId }) } }
      );
    },
    onSuccess: () => {
      idempotency.reset();
      queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_STUDENT_FEE_SUMMARY, organizationId] });
      queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_PAYMENT_LEDGER, organizationId] });
      queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_FEE_DEFAULTERS, organizationId] });
      queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_FEE_COLLECTIONS, organizationId] });
    },
  });
};

export const LEDGER_PAGE_SIZE = 50;

const fetchLedgerPage = async (organizationId: string, page: number, limit: number) => {
  const result = await apiClient.get<null, IAxiosResponse<{ items: IPayment[]; total_count: number }>>(`${base(organizationId)}/payment`, {
    params: { page, limit },
  });
  return result.data.Data;
};

export const useGetPaymentLedger = (organizationId: string, page: number) =>
  useQuery<{ items: IPayment[]; total_count: number }, IAPIError>({
    queryKey: [API_QUERY_KEY.GET_PAYMENT_LEDGER, organizationId, page],
    queryFn: () => fetchLedgerPage(organizationId, page, LEDGER_PAGE_SIZE),
    enabled: !!organizationId,
    // the current page stays on screen while the next one loads
    placeholderData: keepPreviousData,
  });

// every payment of the school, page by page, for the export
export const fetchWholeLedger = async (organizationId: string) => {
  const all: IPayment[] = [];
  for (let page = 1; ; page++) {
    const { items, total_count } = await fetchLedgerPage(organizationId, page, 100);
    all.push(...items);
    if (!items.length || all.length >= total_count) return all;
  }
};

export const downloadFeeReceipt = async (organizationId: string, paymentId: string) => {
  const result = await apiClient.get(`${base(organizationId)}/payment/${paymentId}/receipt`, { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([result.data], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `receipt-${paymentId}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

// emails the same PDF to the caller's own registered address - no arbitrary recipient
export const useEmailFeeReceipt = (organizationId: string) =>
  useMutation<void, IAPIError, string>({
    mutationKey: [API_MUTATION_KEY.EMAIL_FEE_RECEIPT],
    mutationFn: async (paymentId) => {
      await apiClient.post(`${base(organizationId)}/payment/${paymentId}/receipt/email`);
    },
  });

interface IGrantConcessionPayload {
  studentFeeId: string;
  amount: number;
  reason: string;
  installmentLabel?: string;
}

// same idempotency convention as record/reverse payment above
export const useGrantConcession = (organizationId: string) => {
  const queryClient = useQueryClient();
  const idempotency = useIdempotencyKey();
  return useMutation<void, IAPIError, IGrantConcessionPayload>({
    mutationKey: [API_MUTATION_KEY.GRANT_CONCESSION],
    mutationFn: async ({ studentFeeId, ...value }) => {
      await apiClient.post(`${base(organizationId)}/student-fee/${studentFeeId}/concession`, value, {
        headers: { "Idempotency-Key": idempotency.keyFor({ studentFeeId, ...value }) },
      });
    },
    onSuccess: () => {
      idempotency.reset();
      queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_STUDENT_FEE_SUMMARY, organizationId] });
    },
  });
};

export const DEFAULTERS_PAGE_SIZE = 50;

export interface DefaulterFilters {
  academicYearId?: string;
  classId?: string;
  sectionId?: string;
  asOf?: string;
}

const fetchDefaultersPage = async (organizationId: string, filters: DefaulterFilters, page: number, limit: number) => {
  const result = await apiClient.get<null, IAxiosResponse<IFeeDefaultersResult>>(`${base(organizationId)}/report/defaulters`, {
    params: { ...filters, page, limit },
  });
  return result.data.Data;
};

export const useGetFeeDefaulters = (organizationId: string, filters: DefaulterFilters, page: number) =>
  useQuery<IFeeDefaultersResult, IAPIError>({
    queryKey: [API_QUERY_KEY.GET_FEE_DEFAULTERS, organizationId, filters, page],
    queryFn: () => fetchDefaultersPage(organizationId, filters, page, DEFAULTERS_PAGE_SIZE),
    enabled: !!organizationId && !!filters.academicYearId,
    placeholderData: keepPreviousData,
  });

// every defaulter for the current filters, page by page, for the export
export const fetchAllDefaulters = async (organizationId: string, filters: DefaulterFilters) => {
  const all: IFeeDefaultersResult["items"] = [];
  for (let page = 1; ; page++) {
    const { items, total_count } = await fetchDefaultersPage(organizationId, filters, page, 100);
    all.push(...items);
    if (!items.length || all.length >= total_count) return all;
  }
};

export const useGetFeeCollections = (organizationId: string, from: string, to: string) =>
  useQuery<IFeeCollectionSummary, IAPIError>({
    queryKey: [API_QUERY_KEY.GET_FEE_COLLECTIONS, organizationId, from, to],
    queryFn: async () => {
      const result = await apiClient.get<null, IAxiosResponse<{ item: IFeeCollectionSummary }>>(`${base(organizationId)}/report/collections`, {
        params: { from, to },
      });
      return result.data.Data.item;
    },
    enabled: !!organizationId && !!from && !!to && from <= to,
    placeholderData: keepPreviousData,
  });

export interface IOnlinePaymentForReview {
  _id: string;
  amount: number;
  gatewayPaymentId?: string;
  reviewReason?: string;
  createdAt: string;
  studentId: { name: string; admissionNumber?: string } | null;
}

// online payments that arrived but couldn't be applied (the balance changed in between)
export const useGetOnlinePaymentsForReview = (organizationId: string) =>
  useQuery<IOnlinePaymentForReview[], IAPIError>({
    queryKey: ["get-online-payments-review", organizationId],
    queryFn: async () => {
      const result = await apiClient.get<null, IAxiosResponse<{ items: IOnlinePaymentForReview[] }>>(`${base(organizationId)}/online-payment/review`);
      return result.data.Data.items;
    },
    enabled: !!organizationId,
  });
