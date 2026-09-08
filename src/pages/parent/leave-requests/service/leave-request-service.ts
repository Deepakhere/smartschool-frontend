import { useQuery, useMutation, useQueryClient } from "react-query";

import apiClient from "../../../../config";
import { IAPIError, IAxiosResponse, ILeaveRequest } from "../../../../types";
import { APIS_ROUTES, API_QUERY_KEY, API_MUTATION_KEY } from "../../../../utils";

const base = (organizationId: string) => `${APIS_ROUTES.LEAVE_SERVICE}/${organizationId}`;

export const useGetMyLeaveRequests = (organizationId: string) =>
  useQuery<{ items: ILeaveRequest[] }, IAPIError>(
    [API_QUERY_KEY.GET_MY_LEAVE_REQUESTS, organizationId],
    async () => {
      const result = await apiClient.get<null, IAxiosResponse<{ items: ILeaveRequest[] }>>(
        `${base(organizationId)}/my-requests`
      );
      return result.data.Data;
    },
    { enabled: !!organizationId, cacheTime: 0 }
  );

export const useCreateLeaveRequest = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<ILeaveRequest, IAPIError, FormData>(
    [API_MUTATION_KEY.CREATE_LEAVE_REQUEST],
    async (data) => {
      const result = await apiClient.post<FormData, IAxiosResponse<{ item: ILeaveRequest }>>(
        `${base(organizationId)}/create`,
        data
      );
      return result.data.Data.item;
    },
    { onSuccess: () => queryClient.invalidateQueries([API_QUERY_KEY.GET_MY_LEAVE_REQUESTS, organizationId]) }
  );
};

export const useCancelLeaveRequest = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, string>(
    [API_MUTATION_KEY.CANCEL_LEAVE_REQUEST],
    async (leaveRequestId) => {
      await apiClient.post(`${base(organizationId)}/${leaveRequestId}/cancel`);
    },
    { onSuccess: () => queryClient.invalidateQueries([API_QUERY_KEY.GET_MY_LEAVE_REQUESTS, organizationId]) }
  );
};
