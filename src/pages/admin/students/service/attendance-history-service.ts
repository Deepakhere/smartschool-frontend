import { useQuery } from "react-query";

import apiClient from "../../../../config";
import { IAPIError, IAxiosResponse, IAttendanceRecord } from "../../../../types";
import { APIS_ROUTES } from "../../../../utils";

interface IAttendanceHistoryResponse {
  items: IAttendanceRecord[];
  summary: { present: number; absent: number; late: number; excused: number; total: number };
}

export const useGetStudentAttendanceHistory = (organizationId: string, studentId: string) =>
  useQuery<IAttendanceHistoryResponse, IAPIError>(
    ["get-student-attendance-history", studentId],
    async () => {
      const result = await apiClient.get<null, IAxiosResponse<IAttendanceHistoryResponse>>(
        `${APIS_ROUTES.ATTENDANCE_SERVICE}/${organizationId}/student/${studentId}`
      );
      return result.data.Data;
    },
    { enabled: !!organizationId && !!studentId, cacheTime: 0 }
  );
