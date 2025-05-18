import { IAPIError, IAxiosResponse } from "../../../types";
import { APIS_ROUTES, API_QUERY_KEY } from "../../../utils";
import apiClient from "../../../config";
import { useMutation } from "react-query";

interface IContentResponse {
  content: string;
}

interface IGenerateContentRequest {
  title: string;
  type: string;
}

const getAiGeneratedContent = async (
  values: IGenerateContentRequest
): Promise<IContentResponse> => {
  const result = await apiClient.post<
    IGenerateContentRequest,
    IAxiosResponse<{ item: IContentResponse }>
  >(APIS_ROUTES.AI_SERVICE, values);

  return result.data.Data.item;
};

const useGetAiGeneratedContent = () =>
  useMutation<IContentResponse, IAPIError, IGenerateContentRequest>(
    [API_QUERY_KEY.AI_CONTENT],
    (values: IGenerateContentRequest) => getAiGeneratedContent(values)
  );

export default useGetAiGeneratedContent;
