import { useQuery } from "react-query";

import { IAPIError, IAxiosResponse } from "../../../../../types";
import { APIS_ROUTES, API_QUERY_KEY } from "../../../../../utils";
import apiClient from "../../../../../config";

interface IParentResponse {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
}

const getParentByEmail = async (
  organizationId: string,
  email: string
): Promise<{ item: IParentResponse; is_parent_exist: boolean }> => {
  const result = await apiClient.get<
    null,
    IAxiosResponse<{ item: IParentResponse; is_parent_exist: boolean }>
  >(
    `${APIS_ROUTES.STUDENT_PROFILE}/${organizationId}/get-parent-profile/${email}`
  );

  return result.data.Data;
};

const useGetParentByEmail = (organizationId: string, email: string) =>
  useQuery<{ item: IParentResponse; is_parent_exist: boolean }, IAPIError>(
    [API_QUERY_KEY.GET_PARENT_DETAILS],
    () => getParentByEmail(organizationId, email),
    {
      cacheTime: 0,
      enabled: !!email,
    }
  );

export default useGetParentByEmail;
