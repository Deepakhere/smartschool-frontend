import { useQuery } from "react-query";

import apiClient from "../../../../config";
import { IAPIError, IAxiosResponse } from "../../../../types";
import { APIS_ROUTES } from "../../../../utils";

export interface IMyChildLink {
  id: string;
  isPrimaryGuardian: boolean;
  studentId: {
    id: string;
    name: string;
    admissionNumber: string;
    currentEnrollment?: {
      classId?: { id: string; name: string };
      sectionId?: { id: string; name: string };
    };
  };
}

export const useGetMyChildren = (organizationId: string) =>
  useQuery<{ items: IMyChildLink[] }, IAPIError>(
    ["get-my-children", organizationId],
    async () => {
      const result = await apiClient.get<null, IAxiosResponse<{ items: IMyChildLink[] }>>(
        `${APIS_ROUTES.STUDENT_PROFILE}/${organizationId}/my-children`
      );
      return result.data.Data;
    },
    { enabled: !!organizationId, cacheTime: 0 }
  );
