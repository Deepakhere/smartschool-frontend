import { useQuery, useMutation, useQueryClient } from "react-query";

import apiClient from "../../../../config";
import { IAPIError, IAxiosResponse, ITeacherDirectoryEntry, IStaffProfile } from "../../../../types";
import { APIS_ROUTES, API_QUERY_KEY } from "../../../../utils";

export const useGetTeacherDirectory = (organizationId: string) =>
  useQuery<{ items: ITeacherDirectoryEntry[]; total_count: number }, IAPIError>(
    [API_QUERY_KEY.GET_TEACHER_DIRECTORY, organizationId],
    async () => {
      const result = await apiClient.get<
        null,
        IAxiosResponse<{ items: ITeacherDirectoryEntry[]; total_count: number }>
      >(`${APIS_ROUTES.STAFF_SERVICE}/${organizationId}/teacher`);
      return result.data.Data;
    },
    { enabled: !!organizationId, cacheTime: 0 }
  );

interface IUpsertStaffProfileValue {
  userId: string;
  employeeCode?: string;
  designation?: string;
  department?: string;
  qualification?: string;
  dateOfJoining?: string;
  address?: string;
}

export const useUpsertStaffProfile = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<IStaffProfile, IAPIError, IUpsertStaffProfileValue>(
    async (value) => {
      const { userId, ...rest } = value;
      const result = await apiClient.put<null, IAxiosResponse<{ item: IStaffProfile }>>(
        `${APIS_ROUTES.STAFF_SERVICE}/${organizationId}/staff-profile/${userId}`,
        rest
      );
      return result.data.Data.item;
    },
    { onSuccess: () => queryClient.invalidateQueries([API_QUERY_KEY.GET_TEACHER_DIRECTORY, organizationId]) }
  );
};
