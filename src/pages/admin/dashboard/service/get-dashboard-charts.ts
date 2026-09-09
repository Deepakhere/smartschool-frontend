import { useQuery } from "@tanstack/react-query";

import apiClient from "@/config";
import { IAPIError, IAxiosResponse } from "@/types";
import { APIS_ROUTES, API_QUERY_KEY } from "@/utils";

export interface IDashboardCharts {
  examTrend: { name: string; percentage: number }[];
  monthlyAttendance: { month: string; percentage: number }[];
}

const getDashboardCharts = async (organizationId: string): Promise<IDashboardCharts> => {
  const result = await apiClient.get<null, IAxiosResponse<{ item: IDashboardCharts }>>(
    `${APIS_ROUTES.DASHBOARD_SERVICE}/${organizationId}/charts`
  );
  return result.data.Data.item;
};

const useGetDashboardCharts = (organizationId: string) =>
  useQuery<IDashboardCharts, IAPIError>({
    queryKey: [API_QUERY_KEY.GET_DASHBOARD_CHARTS, organizationId],
    queryFn: () => getDashboardCharts(organizationId),
    enabled: !!organizationId,
  });

export default useGetDashboardCharts;
