import { useMutation, useQuery, useQueryClient } from "react-query";

import apiClient from "../../../../config";
import { IAPIError, IAxiosResponse, IEnrollmentHistoryEntry } from "../../../../types";
import { API_QUERY_KEY, APIS_ROUTES } from "../../../../utils";

const base = (organizationId: string, studentId: string) =>
  `${APIS_ROUTES.STUDENT_PROFILE}/${organizationId}/student/${studentId}`;

export const useGetEnrollmentHistory = (organizationId: string, studentId: string) =>
  useQuery<{ items: IEnrollmentHistoryEntry[] }, IAPIError>(
    ["get-enrollment-history", studentId],
    async () => {
      const result = await apiClient.get<null, IAxiosResponse<{ items: IEnrollmentHistoryEntry[] }>>(
        `${base(organizationId, studentId)}/enrollment-history`
      );
      return result.data.Data;
    },
    { enabled: !!organizationId && !!studentId, cacheTime: 0 }
  );

export const useTransferStudent = (organizationId: string, studentId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, void>(
    async () => {
      await apiClient.put(`${base(organizationId, studentId)}/transfer`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([API_QUERY_KEY.GET_STUDENT_BY_ID, studentId]);
        queryClient.invalidateQueries(["get-enrollment-history", studentId]);
      },
    }
  );
};

export const useWithdrawStudent = (organizationId: string, studentId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, void>(
    async () => {
      await apiClient.put(`${base(organizationId, studentId)}/withdraw`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([API_QUERY_KEY.GET_STUDENT_BY_ID, studentId]);
        queryClient.invalidateQueries(["get-enrollment-history", studentId]);
      },
    }
  );
};
