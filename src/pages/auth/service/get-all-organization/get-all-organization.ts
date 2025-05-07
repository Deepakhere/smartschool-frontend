import { useQuery } from "react-query";

import apiClient from "../../../../config";
import { IAPIError, IAxiosResponse } from "../../../../types";
import { APIS_ROUTES, API_QUERY_KEY } from "../../../../utils";

interface IOrganization {
  id: string;
  name: string;
  description: string;
  country: string;
  users: string[];
  location: string;
  pincode: string;
  status: string;
}

const getAllOrganizations = async () => {
  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: IOrganization[] }>
  >(`${APIS_ROUTES.ORGANIZATION_SERVICE}/get-all-organizations`);

  return result.data.Data;
};

const useGetAllOrganizations = () =>
  useQuery<{ items: IOrganization[] }, IAPIError>(
    [API_QUERY_KEY.GET_ALL_ORGANIZATIONS],
    () => getAllOrganizations(),
    {
      cacheTime: 0,
    }
  );

export default useGetAllOrganizations;
