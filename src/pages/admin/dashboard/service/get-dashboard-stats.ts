import { useQuery } from "react-query";

import apiClient from "../../../../config";
import { IAPIError, IAxiosResponse } from "../../../../types";
import { APIS_ROUTES, API_QUERY_KEY } from "../../../../utils";

export interface IDashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  activeNotices: number;
  pendingPayments: number | null;
  attendanceToday: number | null;
  homeworksToday: number | null;
}

const getDashboardStats = async (organizationId: string): Promise<IDashboardStats> => {
  const result = await apiClient.get<null, IAxiosResponse<{ item: IDashboardStats }>>(
    `${APIS_ROUTES.DASHBOARD_SERVICE}/${organizationId}/stats`
  );
  return result.data.Data.item;
};

const useGetDashboardStats = (organizationId: string) =>
  useQuery<IDashboardStats, IAPIError>(
    [API_QUERY_KEY.GET_DASHBOARD_STATS, organizationId],
    () => getDashboardStats(organizationId),
    { enabled: !!organizationId, cacheTime: 0 }
  );

export default useGetDashboardStats;
