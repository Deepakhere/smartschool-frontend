import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/config";
import { IAPIError, IAxiosResponse, ICreateNoticeRequest } from "@/types";
import { API_MUTATION_KEY, API_QUERY_KEY, APIS_ROUTES } from "@/utils";

interface ICreatNoticeResponse {
  id: string;
  title: string;
  content: string;
  date: string;
  type: string;
  attachment?: File | null;
}

const createNotice = async (organizationId: string, data: FormData | ICreateNoticeRequest) => {
  const response = await apiClient.post<ICreateNoticeRequest, IAxiosResponse<ICreatNoticeResponse>>(
    `${APIS_ROUTES.SCHOOL_SERVICE}/notice/${organizationId}/create-notice`,
    data
  );

  return response.data.Data;
};

const useCreateNotice = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<ICreatNoticeResponse, IAPIError, FormData | ICreateNoticeRequest>({
    mutationKey: [API_MUTATION_KEY.CREATE_NOTICE],
    mutationFn: (data: FormData | ICreateNoticeRequest) => createNotice(organizationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_NOTICE_LIST, organizationId] });
      queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_MY_NOTICES] });
    },
  });
};

export default useCreateNotice;
