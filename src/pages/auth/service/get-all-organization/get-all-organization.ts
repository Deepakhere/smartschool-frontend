import { useQuery } from "@tanstack/react-query";

import apiClient from "@/config";
import { IAPIError, IAxiosResponse, IOrganization } from "@/types";
import { APIS_ROUTES, API_QUERY_KEY } from "@/utils";

const getAllOrganizations = async () => {
  const result = await apiClient.get<null, IAxiosResponse<{ items: IOrganization[] }>>(
    `${APIS_ROUTES.ORGANIZATION_SERVICE}/get-all-organizations`
  );

  return result.data.Data;
};

const useGetAllOrganizations = (enabled = true) =>
  useQuery<{ items: IOrganization[] }, IAPIError>({
    queryKey: [API_QUERY_KEY.GET_ALL_ORGANIZATIONS],
    queryFn: () => getAllOrganizations(),
    enabled,
  });

export default useGetAllOrganizations;
