import { useQuery } from "react-query";

import apiClient from "../../../../config";
import { IAPIError, IAxiosResponse, IHomework } from "../../../../types";
import { APIS_ROUTES, API_QUERY_KEY } from "../../../../utils";

export const useGetHomeworkForStudent = (organizationId: string, studentId: string) =>
  useQuery<{ items: IHomework[] }, IAPIError>(
    [API_QUERY_KEY.GET_HOMEWORK_LIST, "for-student", organizationId, studentId],
    async () => {
      const result = await apiClient.get<null, IAxiosResponse<{ items: IHomework[] }>>(
        `${APIS_ROUTES.HOMEWORK_SERVICE}/${organizationId}/student/${studentId}`
      );
      return result.data.Data;
    },
    { enabled: !!organizationId && !!studentId, cacheTime: 0 }
  );
