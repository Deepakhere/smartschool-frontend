import { useMutation, useQuery, useQueryClient } from "react-query";

import apiClient from "../../../config/api-client";
import { IAPIError, IAxiosResponse, INotification } from "../../../types";
import { APIS_ROUTES, API_QUERY_KEY, API_MUTATION_KEY } from "../../../utils";

type MyNotificationsResponse = { items: INotification[]; unread_count: number };

export const useGetMyNotifications = (organizationId?: string) =>
  useQuery<MyNotificationsResponse, IAPIError>(
    [API_QUERY_KEY.GET_MY_NOTIFICATIONS, organizationId],
    async () => {
      const result = await apiClient.get<null, IAxiosResponse<MyNotificationsResponse>>(
        `${APIS_ROUTES.SCHOOL_SERVICE}/notice/${organizationId}/my-notifications`
      );
      return result.data.Data;
    },
    { enabled: !!organizationId, cacheTime: 0 }
  );

export const useMarkNotificationRead = (organizationId?: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, string>(
    [API_MUTATION_KEY.MARK_NOTIFICATION_READ],
    async (notificationId: string) => {
      await apiClient.post(
        `${APIS_ROUTES.SCHOOL_SERVICE}/notice/${organizationId}/notification/${notificationId}/read`
      );
    },
    { onSuccess: () => queryClient.invalidateQueries([API_QUERY_KEY.GET_MY_NOTIFICATIONS, organizationId]) }
  );
};

export const useMarkAllNotificationsRead = (organizationId?: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, void>(
    [API_MUTATION_KEY.MARK_ALL_NOTIFICATIONS_READ],
    async () => {
      await apiClient.post(`${APIS_ROUTES.SCHOOL_SERVICE}/notice/${organizationId}/notifications/read-all`);
    },
    { onSuccess: () => queryClient.invalidateQueries([API_QUERY_KEY.GET_MY_NOTIFICATIONS, organizationId]) }
  );
};
