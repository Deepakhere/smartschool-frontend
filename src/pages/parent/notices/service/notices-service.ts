import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import apiClient from "@/config";
import { IAPIError, IAxiosResponse, INotice } from "@/types";
import { APIS_ROUTES, API_QUERY_KEY, API_MUTATION_KEY } from "@/utils";

export const useGetMyNotices = (organizationId: string) =>
  useQuery<{ items: INotice[] }, IAPIError>({
    queryKey: [API_QUERY_KEY.GET_MY_NOTICES, organizationId],
    queryFn: async () => {
      const result = await apiClient.get<null, IAxiosResponse<{ items: INotice[] }>>(
        `${APIS_ROUTES.SCHOOL_SERVICE}/notice/${organizationId}/my-notices`
      );
      return result.data.Data;
    },
    enabled: !!organizationId,
  });

export const useMarkNoticeRead = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, string>({
    mutationKey: [API_MUTATION_KEY.MARK_NOTICE_READ],
    mutationFn: async (noticeId: string) => {
      await apiClient.post(`${APIS_ROUTES.SCHOOL_SERVICE}/notice/${organizationId}/notice/${noticeId}/read`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_MY_NOTICES, organizationId] }),
  });
};
