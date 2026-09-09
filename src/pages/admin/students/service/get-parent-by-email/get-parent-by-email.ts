import { useQuery } from "@tanstack/react-query";

import { IAPIError, IAxiosResponse } from "@/types";
import { APIS_ROUTES, API_QUERY_KEY } from "@/utils";
import apiClient from "@/config";

interface IParentResponse {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
}

const getParentByEmail = async (
  organizationId: string,
  email: string
): Promise<{ item: IParentResponse; is_parent_exists: boolean }> => {
  const result = await apiClient.get<null, IAxiosResponse<{ item: IParentResponse; is_parent_exists: boolean }>>(
    `${APIS_ROUTES.STUDENT_PROFILE}/${organizationId}/get-parent-profile/${email}`
  );

  return result.data.Data;
};

const useGetParentByEmail = (organizationId: string, email: string) =>
  useQuery<{ item: IParentResponse; is_parent_exists: boolean }, IAPIError>({
    queryKey: [API_QUERY_KEY.GET_PARENT_DETAILS, organizationId, email],
    queryFn: () => getParentByEmail(organizationId, email),
    enabled: !!organizationId && !!email,
  });

export default useGetParentByEmail;
