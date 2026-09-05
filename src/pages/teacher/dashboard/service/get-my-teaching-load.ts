import { useQuery } from "react-query";

import apiClient from "../../../../config";
import { IAPIError, IAxiosResponse } from "../../../../types";
import { APIS_ROUTES, API_QUERY_KEY } from "../../../../utils";

interface ITeacherAssignmentEntry {
  id: string;
  classId: { id: string; name: string };
  sectionId: { id: string; name: string };
  subjectId: { id: string; name: string; code: string } | null;
  assignmentRole: "SUBJECT_TEACHER" | "CLASS_TEACHER";
}

interface ITimetableSlotEntry {
  id: string;
  subjectId: { id: string; name: string; code: string };
  classId: { id: string; name: string };
  sectionId: { id: string; name: string };
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room?: string;
}

interface INoticeEntry {
  id: string;
  title: string;
  type: string;
  createdAt: string;
}

export interface IMyTeachingLoad {
  assignments: ITeacherAssignmentEntry[];
  todaySlots: ITimetableSlotEntry[];
  recentNotices: INoticeEntry[];
}

const useGetMyTeachingLoad = (organizationId: string) =>
  useQuery<IMyTeachingLoad, IAPIError>(
    [API_QUERY_KEY.GET_MY_TEACHING_LOAD, organizationId],
    async () => {
      const result = await apiClient.get<null, IAxiosResponse<{ item: IMyTeachingLoad }>>(
        `${APIS_ROUTES.STAFF_SERVICE}/${organizationId}/my-teaching-load`
      );
      return result.data.Data.item;
    },
    { enabled: !!organizationId, cacheTime: 0 }
  );

export default useGetMyTeachingLoad;
