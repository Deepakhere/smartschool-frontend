import { useQuery } from "@tanstack/react-query";

import apiClient from "@/config/api-client";
import { IAPIError, IAxiosResponse, IAllUserDetails, Paged } from "@/types";
import { APIS_ROUTES, API_QUERY_KEY } from "@/utils";

export const USERS_PAGE_SIZE = 50;

const getAllUserDetails = async (
  organizationId: string,
  searchTerm: string,
  filterRole: string,
  page: number
): Promise<Paged<IAllUserDetails>> => {
  const result = await apiClient.get<null, IAxiosResponse<Paged<IAllUserDetails>>>(
    `${APIS_ROUTES.GET_ALL_USER}/${organizationId}`,
    {
      params: {
        search_term: searchTerm,
        role: filterRole,
        page,
        limit: USERS_PAGE_SIZE,
      },
    }
  );

  return result.data.Data;
};

const useGetAllUserDetails = (organizationId: string, searchTerm: string, filterRole: string, page = 1) =>
  useQuery<Paged<IAllUserDetails>, IAPIError>({
    // organizationId + the filters are part of the key so a tenant switch or a filter change is a
    // genuinely different cache entry, not a stale one - and no manual refetch effect is needed
    queryKey: [API_QUERY_KEY.GET_ALL_USER, organizationId, searchTerm, filterRole, page],
    queryFn: () => getAllUserDetails(organizationId, searchTerm, filterRole, page),
    enabled: !!organizationId,
  });

export default useGetAllUserDetails;
