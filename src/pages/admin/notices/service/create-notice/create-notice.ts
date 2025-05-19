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
  attachments: string[];
}

const createNotice = async (
  organizationId: string,
  data: ICreateNoticeRequest
) => {
  const response = await apiClient.post<
    ICreateNoticeRequest,
    IAxiosResponse<ICreatNoticeResponse>
  >(`${APIS_ROUTES.SCHOOL_SERVICE}/${organizationId}/create-notice`, data);

  return response.data.Data;
};

const useCreateNotice = (organizationId: string) => {
  return useMutation<ICreatNoticeResponse, IAPIError, ICreateNoticeRequest>(
    [API_MUTATION_KEY.ADD_STUDENT_PROFILE],
    (data: ICreateNoticeRequest) => createNotice(organizationId, data)
  );
};

export default useCreateNotice;
