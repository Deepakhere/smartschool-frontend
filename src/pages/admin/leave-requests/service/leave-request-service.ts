import { useQuery, useMutation, useQueryClient } from "react-query";

import apiClient from "../../../../config";
import { IAPIError, IAxiosResponse, ILeaveRequest } from "../../../../types";
import { APIS_ROUTES, API_QUERY_KEY, API_MUTATION_KEY } from "../../../../utils";

const base = (organizationId: string) => `${APIS_ROUTES.LEAVE_SERVICE}/${organizationId}`;

export const useGetLeaveRequestsReviewQueue = (organizationId: string, status: string) =>
  useQuery<{ items: ILeaveRequest[] }, IAPIError>(
    [API_QUERY_KEY.GET_LEAVE_REQUESTS_REVIEW_QUEUE, organizationId, status],
    async () => {
      const result = await apiClient.get<null, IAxiosResponse<{ items: ILeaveRequest[] }>>(
        `${base(organizationId)}/review-queue`,
        { params: status ? { status } : {} }
      );
      return result.data.Data;
    },
    { enabled: !!organizationId, cacheTime: 0 }
  );

interface DecideVariables {
  leaveRequestId: string;
  status: "approved" | "rejected";
  decisionNote?: string;
}

export const useDecideLeaveRequest = (organizationId: string, status: string) => {
  const queryClient = useQueryClient();
  return useMutation<ILeaveRequest, IAPIError, DecideVariables>(
    [API_MUTATION_KEY.DECIDE_LEAVE_REQUEST],
    async ({ leaveRequestId, status: decision, decisionNote }) => {
      const result = await apiClient.post<
        { status: string; decisionNote?: string },
        IAxiosResponse<{ item: ILeaveRequest }>
      >(`${base(organizationId)}/${leaveRequestId}/decide`, { status: decision, decisionNote });
      return result.data.Data.item;
    },
    {
      onSuccess: () =>
        queryClient.invalidateQueries([API_QUERY_KEY.GET_LEAVE_REQUESTS_REVIEW_QUEUE, organizationId, status]),
    }
  );
};
