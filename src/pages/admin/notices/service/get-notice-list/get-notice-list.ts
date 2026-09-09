import { useQuery } from "@tanstack/react-query";

import { IAPIError, IAxiosResponse } from "../../../../../types";
import { APIS_ROUTES, API_QUERY_KEY } from "../../../../../utils";
import apiClient from "../../../../../config";

interface INoticeResponse {
  id: string;
  title: string;
  content: string;
  date: string;
  type: "holiday" | "announcement";
  createdAt: string;
  updatedAt: string;
  attachmentURL: string;
}

const getNoticeList = async (
  organizationId: string | undefined,
  searchTerm: string,
  type: string,
  limit: number,
  page: number
): Promise<{ items: INoticeResponse[]; total_count: number }> => {
  if (!organizationId) {
    return { items: [], total_count: 0 };
  }

  const result = await apiClient.get<null, IAxiosResponse<{ items: INoticeResponse[]; total_count: number }>>(
    `${APIS_ROUTES.SCHOOL_SERVICE}/notice/${organizationId}/get-notice-list`,
    {
      params: {
        search_term: searchTerm,
        type: type,
        limit: limit,
        page: page,
      },
    }
  );

  return result.data.Data;
};

const useGetNoticeList = (
  organizationId: string | undefined,
  searchTerm: string,
  type: string,
  limit: number,
  page: number
) =>
  useQuery<{ items: INoticeResponse[]; total_count: number }, IAPIError>({
    queryKey: [API_QUERY_KEY.GET_NOTICE_LIST, organizationId, searchTerm, type, limit, page],
    queryFn: () => getNoticeList(organizationId, searchTerm, type, limit, page),
    enabled: !!organizationId,
  });

export default useGetNoticeList;
