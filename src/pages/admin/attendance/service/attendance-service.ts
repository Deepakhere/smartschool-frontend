import { useQuery, useMutation, useQueryClient } from "react-query";

import apiClient from "../../../../config";
import {
  IAPIError,
  IAxiosResponse,
  IAttendanceRecord,
  IAttendanceSession,
  AttendanceStatus,
} from "../../../../types";
import { APIS_ROUTES, API_QUERY_KEY } from "../../../../utils";

const base = (organizationId: string) => `${APIS_ROUTES.ATTENDANCE_SERVICE}/${organizationId}`;

export interface ISectionRosterStudent {
  id: string;
  name: string;
  currentEnrollment: { rollNumber: string } | null;
}

export const useGetSectionRoster = (organizationId: string, sectionId: string) =>
  useQuery<{ items: ISectionRosterStudent[] }, IAPIError>(
    ["get-section-roster", organizationId, sectionId],
    async () => {
      const result = await apiClient.get<null, IAxiosResponse<{ items: ISectionRosterStudent[] }>>(
        `${APIS_ROUTES.STUDENT_PROFILE}/${organizationId}/get-student-profile`,
        { params: { sectionId, limit: 200, page: 1 } }
      );
      return result.data.Data;
    },
    { enabled: !!organizationId && !!sectionId, cacheTime: 0 }
  );

export const useGetSectionAttendance = (organizationId: string, sectionId: string, date: string) =>
  useQuery<{ item: { session: IAttendanceSession; records: IAttendanceRecord[] } | null }, IAPIError>(
    [API_QUERY_KEY.GET_SECTION_ATTENDANCE, organizationId, sectionId, date],
    async () => {
      const result = await apiClient.get<
        null,
        IAxiosResponse<{ item: { session: IAttendanceSession; records: IAttendanceRecord[] } | null }>
      >(`${base(organizationId)}/section`, { params: { sectionId, date } });
      return result.data.Data;
    },
    { enabled: !!organizationId && !!sectionId && !!date, cacheTime: 0 }
  );

interface IMarkAttendanceValue {
  sectionId: string;
  date: string;
  records: { studentId: string; status: AttendanceStatus; reason?: string }[];
}

export const useMarkAttendance = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, IMarkAttendanceValue>(
    async (value) => {
      await apiClient.post(`${base(organizationId)}/mark`, value);
    },
    {
      onSuccess: (_data, variables) =>
        queryClient.invalidateQueries([
          API_QUERY_KEY.GET_SECTION_ATTENDANCE,
          organizationId,
          variables.sectionId,
          variables.date,
        ]),
    }
  );
};
