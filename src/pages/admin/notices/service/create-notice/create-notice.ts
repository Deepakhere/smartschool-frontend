import { useMutation } from "react-query";
import apiClient from "../../../../../config";
import {
  IAPIError,
  IAxiosResponse,
  ICreateNoticeRequest,
} from "../../../../../types";
import { API_MUTATION_KEY, APIS_ROUTES } from "../../../../../utils";

interface ICreatNoticeResponse {
  id: string;
  title: string;
  content: string;
  date: string;
  type: string;
  attachment?: File | null;
}

const createNotice = async (
  organizationId: string,
  data: ICreateNoticeRequest
) => {
  const response = await apiClient.post<
    ICreateNoticeRequest,
    IAxiosResponse<ICreatNoticeResponse>
  >(
    `${APIS_ROUTES.SCHOOL_SERVICE}/notice/${organizationId}/create-notice`,
    data
  );

  return response.data.Data;
};

const useCreateNotice = (organizationId: string) => {
  return useMutation<ICreatNoticeResponse, IAPIError, ICreateNoticeRequest>(
    [API_MUTATION_KEY.CREATE_NOTICE],
    (data: ICreateNoticeRequest) => createNotice(organizationId, data)
  );
};

export default useCreateNotice;
