import { useQuery } from "react-query";

import apiClient from "../../../../../config/api-client";
import {
  IAPIError,
  IAxiosResponse,
  IAllUserDetails,
} from "../../../../../types";
import { APIS_ROUTES, API_QUERY_KEY } from "../../../../../utils";

const getAllUserDetails = async (
  organizationId: string,
  searchTerm: string,
  filterRole: string
): Promise<{ items: IAllUserDetails[]; total_count: number }> => {
  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: IAllUserDetails[]; total_count: number }>
  >(`${APIS_ROUTES.GET_ALL_USER}/${organizationId}`, {
    params: {
      search_term: searchTerm,
      role: filterRole,
    },
  });

  return result.data.Data;
};

const useGetAllUserDetails = (
  organizationId: string,
  searchTerm: string,
  filterRole: string
) =>
  useQuery<{ items: IAllUserDetails[]; total_count: number }, IAPIError>(
    [API_QUERY_KEY.GET_ALL_USER],
    () => getAllUserDetails(organizationId, searchTerm, filterRole),
    {
      cacheTime: 0,
      enabled: !!organizationId,
    }
  );

export default useGetAllUserDetails;
