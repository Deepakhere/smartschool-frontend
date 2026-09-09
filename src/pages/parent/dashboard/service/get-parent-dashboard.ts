import { useQuery } from "@tanstack/react-query";

import apiClient from "@/config";
import { IAPIError, IAxiosResponse } from "@/types";
import { APIS_ROUTES, API_QUERY_KEY } from "@/utils";

export interface IParentDashboardStats {
  childrenCount: number;
  upcomingHomeworkCount: number;
  pendingFeesTotal: number;
  recentNoticesCount: number;
}

const getParentDashboard = async (organizationId: string): Promise<IParentDashboardStats> => {
  const result = await apiClient.get<null, IAxiosResponse<{ item: IParentDashboardStats }>>(
    `${APIS_ROUTES.DASHBOARD_SERVICE}/${organizationId}/parent-stats`
  );
  return result.data.Data.item;
};

const useGetParentDashboard = (organizationId: string) =>
  useQuery<IParentDashboardStats, IAPIError>({
    queryKey: [API_QUERY_KEY.GET_PARENT_DASHBOARD, organizationId],
    queryFn: () => getParentDashboard(organizationId),
    enabled: !!organizationId,
  });

export default useGetParentDashboard;
