import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import apiClient from "../../../../config";
import { IAPIError, IAxiosResponse, IAttendanceRecord, IAttendanceSession, AttendanceStatus } from "../../../../types";
import { APIS_ROUTES, API_QUERY_KEY } from "../../../../utils";

const base = (organizationId: string) => `${APIS_ROUTES.ATTENDANCE_SERVICE}/${organizationId}`;

export interface ISectionRosterStudent {
  id: string;
  name: string;
  currentEnrollment: { rollNumber: string } | null;
}

export const useGetSectionRoster = (organizationId: string, sectionId: string) =>
  useQuery<{ items: ISectionRosterStudent[] }, IAPIError>({
    queryKey: ["get-section-roster", organizationId, sectionId],
    queryFn: async () => {
      const result = await apiClient.get<null, IAxiosResponse<{ items: ISectionRosterStudent[] }>>(
        `${APIS_ROUTES.STUDENT_PROFILE}/${organizationId}/get-student-profile`,
        { params: { sectionId, limit: 200, page: 1 } }
      );
      return result.data.Data;
    },
    enabled: !!organizationId && !!sectionId,
  });

export const useGetSectionAttendance = (organizationId: string, sectionId: string, date: string) =>
  useQuery<{ item: { session: IAttendanceSession; records: IAttendanceRecord[] } | null }, IAPIError>({
    queryKey: [API_QUERY_KEY.GET_SECTION_ATTENDANCE, organizationId, sectionId, date],
    queryFn: async () => {
      const result = await apiClient.get<
        null,
        IAxiosResponse<{ item: { session: IAttendanceSession; records: IAttendanceRecord[] } | null }>
      >(`${base(organizationId)}/section`, { params: { sectionId, date } });
      return result.data.Data;
    },
    enabled: !!organizationId && !!sectionId && !!date,
  });

export interface ISectionAttendanceReportRow {
  studentId: string;
  studentName: string;
  rollNumber: string;
  present: number;
  absent: number;
  late: number;
  excused: number;
  total: number;
}

export const useGetSectionAttendanceReport = (organizationId: string, sectionId: string, from: string, to: string) =>
  useQuery<{ items: ISectionAttendanceReportRow[]; totalSessions: number }, IAPIError>({
    queryKey: [API_QUERY_KEY.GET_SECTION_ATTENDANCE_REPORT, organizationId, sectionId, from, to],
    queryFn: async () => {
      const result = await apiClient.get<
        null,
        IAxiosResponse<{ items: ISectionAttendanceReportRow[]; totalSessions: number }>
      >(`${base(organizationId)}/section-report`, { params: { sectionId, from, to } });
      return result.data.Data;
    },
    enabled: !!organizationId && !!sectionId && !!from && !!to,
  });

interface IMarkAttendanceValue {
  sectionId: string;
  date: string;
  records: { studentId: string; status: AttendanceStatus; reason?: string }[];
}

export const useMarkAttendance = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, IMarkAttendanceValue>({
    mutationFn: async (value) => {
      await apiClient.post(`${base(organizationId)}/mark`, value);
    },
    onSuccess: (_data, variables) =>
      queryClient.invalidateQueries({
        queryKey: [API_QUERY_KEY.GET_SECTION_ATTENDANCE, organizationId, variables.sectionId, variables.date],
      }),
  });
};
