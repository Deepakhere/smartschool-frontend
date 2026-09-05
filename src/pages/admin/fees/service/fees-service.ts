import { useMutation, useQuery, useQueryClient } from "react-query";

import apiClient from "../../../../config";
import {
  IAPIError,
  IAxiosResponse,
  IFeeHead,
  IFeeStructure,
  IStudentFeeSummary,
  IPayment,
} from "../../../../types";
import { APIS_ROUTES, API_QUERY_KEY, API_MUTATION_KEY } from "../../../../utils";

const base = (organizationId: string) => `${APIS_ROUTES.FEE_SERVICE}/${organizationId}`;

export const useGetFeeHeads = (organizationId: string) =>
  useQuery<{ items: IFeeHead[] }, IAPIError>(
    [API_QUERY_KEY.GET_FEE_HEADS, organizationId],
    async () => {
      const result = await apiClient.get<null, IAxiosResponse<{ items: IFeeHead[] }>>(`${base(organizationId)}/fee-head`);
      return result.data.Data;
    },
    { enabled: !!organizationId, cacheTime: 0 }
  );

export const useCreateFeeHead = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, { name: string; code: string; category: string; isRefundable: boolean }>(
    [API_MUTATION_KEY.CREATE_FEE_HEAD],
    async (value) => {
      await apiClient.post(`${base(organizationId)}/fee-head`, value);
    },
    { onSuccess: () => queryClient.invalidateQueries([API_QUERY_KEY.GET_FEE_HEADS, organizationId]) }
  );
};

export const useGetFeeStructures = (organizationId: string) =>
  useQuery<{ items: IFeeStructure[] }, IAPIError>(
    [API_QUERY_KEY.GET_FEE_STRUCTURES, organizationId],
    async () => {
      const result = await apiClient.get<null, IAxiosResponse<{ items: IFeeStructure[] }>>(
        `${base(organizationId)}/fee-structure`
      );
      return result.data.Data;
    },
    { enabled: !!organizationId, cacheTime: 0 }
  );

interface ICreateFeeStructurePayload {
  academicYearId: string;
  name: string;
  classIds: string[];
  sectionIds: string[];
  items: { feeHeadId: string; amount: number }[];
  installments: { label: string; dueDate: string; amount: number }[];
}

export const useCreateFeeStructure = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, ICreateFeeStructurePayload>(
    [API_MUTATION_KEY.CREATE_FEE_STRUCTURE],
    async (value) => {
      await apiClient.post(`${base(organizationId)}/fee-structure`, value);
    },
    { onSuccess: () => queryClient.invalidateQueries([API_QUERY_KEY.GET_FEE_STRUCTURES, organizationId]) }
  );
};

export const useAssignFeeStructure = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<{ assigned_count: number; skipped_count: number }, IAPIError, string>(
    [API_MUTATION_KEY.ASSIGN_FEE_STRUCTURE],
    async (feeStructureId) => {
      const result = await apiClient.post<null, IAxiosResponse<{ assigned_count: number; skipped_count: number }>>(
        `${base(organizationId)}/fee-structure/${feeStructureId}/assign`
      );
      return result.data.Data;
    },
    { onSuccess: () => queryClient.invalidateQueries([API_QUERY_KEY.GET_STUDENT_FEE_SUMMARY, organizationId]) }
  );
};

export const useGetStudentFeeSummary = (organizationId: string, studentId?: string) =>
  useQuery<{ items: IStudentFeeSummary[] }, IAPIError>(
    [API_QUERY_KEY.GET_STUDENT_FEE_SUMMARY, organizationId, studentId],
    async () => {
      const result = await apiClient.get<null, IAxiosResponse<{ items: IStudentFeeSummary[] }>>(
        `${base(organizationId)}/student-fee/${studentId}`
      );
      return result.data.Data;
    },
    { enabled: !!organizationId && !!studentId, cacheTime: 0 }
  );

export const useGetMyFees = (organizationId: string) =>
  useQuery<{ items: IStudentFeeSummary[] }, IAPIError>(
    [API_QUERY_KEY.GET_MY_FEES, organizationId],
    async () => {
      const result = await apiClient.get<null, IAxiosResponse<{ items: IStudentFeeSummary[] }>>(
        `${base(organizationId)}/my-fees`
      );
      return result.data.Data;
    },
    { enabled: !!organizationId, cacheTime: 0 }
  );

interface IRecordPaymentPayload {
  studentFeeId: string;
  amount: number;
  method: string;
  instrumentRef?: string;
  remarks?: string;
}

export const useRecordPayment = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, IRecordPaymentPayload>(
    [API_MUTATION_KEY.RECORD_PAYMENT],
    async (value) => {
      await apiClient.post(`${base(organizationId)}/payment`, value);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([API_QUERY_KEY.GET_STUDENT_FEE_SUMMARY, organizationId]);
        queryClient.invalidateQueries([API_QUERY_KEY.GET_PAYMENT_LEDGER, organizationId]);
      },
    }
  );
};

export const useReversePayment = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, string>(
    [API_MUTATION_KEY.REVERSE_PAYMENT],
    async (paymentId) => {
      await apiClient.post(`${base(organizationId)}/payment/${paymentId}/reverse`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([API_QUERY_KEY.GET_STUDENT_FEE_SUMMARY, organizationId]);
        queryClient.invalidateQueries([API_QUERY_KEY.GET_PAYMENT_LEDGER, organizationId]);
      },
    }
  );
};

export const useGetPaymentLedger = (organizationId: string) =>
  useQuery<{ items: IPayment[]; total_count: number }, IAPIError>(
    [API_QUERY_KEY.GET_PAYMENT_LEDGER, organizationId],
    async () => {
      const result = await apiClient.get<null, IAxiosResponse<{ items: IPayment[]; total_count: number }>>(
        `${base(organizationId)}/payment`
      );
      return result.data.Data;
    },
    { enabled: !!organizationId, cacheTime: 0 }
  );
