import { useQuery } from "@tanstack/react-query";

import apiClient from "@/config";
import { IAPIError, IAxiosResponse } from "@/types";
import { APIS_ROUTES, API_QUERY_KEY } from "@/utils";

export interface Attention {
  leaveRequests: number;
  ptmBookings: number;
  examsToPublish: number;
}

export type AttentionKey = keyof Attention;

// sidebar badge counts; refreshed every minute and on focus
export const useGetAttention = (organizationId: string, enabled: boolean) =>
  useQuery<Attention, IAPIError>({
    queryKey: [API_QUERY_KEY.GET_ATTENTION, organizationId],
    queryFn: async () => {
      const result = await apiClient.get<null, IAxiosResponse<{ item: Attention }>>(
        `${APIS_ROUTES.DASHBOARD_SERVICE}/${organizationId}/attention`
      );
      return result.data.Data.item;
    },
    enabled: !!organizationId && enabled,
    refetchInterval: 60_000,
    staleTime: 30_000,
  });
