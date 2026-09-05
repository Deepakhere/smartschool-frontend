import { useQuery, useMutation, useQueryClient } from "react-query";

import apiClient from "../../../../config";
import { IAPIError, IAxiosResponse, IHomework } from "../../../../types";
import { APIS_ROUTES, API_QUERY_KEY, API_MUTATION_KEY } from "../../../../utils";

const base = (organizationId: string) => `${APIS_ROUTES.HOMEWORK_SERVICE}/${organizationId}`;

export const useGetHomeworkList = (organizationId: string, sectionId: string) =>
  useQuery<{ items: IHomework[]; total_count: number }, IAPIError>(
    [API_QUERY_KEY.GET_HOMEWORK_LIST, organizationId, sectionId],
    async () => {
      const result = await apiClient.get<null, IAxiosResponse<{ items: IHomework[]; total_count: number }>>(
        `${base(organizationId)}/list`,
        { params: { sectionId } }
      );
      return result.data.Data;
    },
    { enabled: !!organizationId && !!sectionId, cacheTime: 0 }
  );

export const useCreateHomework = (organizationId: string, sectionId: string) => {
  const queryClient = useQueryClient();
  return useMutation<IHomework, IAPIError, FormData>(
    [API_MUTATION_KEY.CREATE_HOMEWORK],
    async (data) => {
      const result = await apiClient.post<FormData, IAxiosResponse<{ item: IHomework }>>(
        `${base(organizationId)}/create`,
        data
      );
      return result.data.Data.item;
    },
    { onSuccess: () => queryClient.invalidateQueries([API_QUERY_KEY.GET_HOMEWORK_LIST, organizationId, sectionId]) }
  );
};

export const useDeleteHomework = (organizationId: string, sectionId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, string>(
    [API_MUTATION_KEY.DELETE_HOMEWORK],
    async (homeworkId) => {
      await apiClient.delete(`${base(organizationId)}/${homeworkId}`);
    },
    { onSuccess: () => queryClient.invalidateQueries([API_QUERY_KEY.GET_HOMEWORK_LIST, organizationId, sectionId]) }
  );
};
