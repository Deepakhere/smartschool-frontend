import { useQuery } from "react-query";

import apiClient from "../../../../../config/api-client";
import {
  IAPIError,
  IAxiosResponse,
  IAllUserDetails,
} from "../../../../../types";
import { APIS_ROUTES, API_QUERY_KEY } from "../../../../../utils";

const getAllUserDetails = async (): Promise<{
  items: IAllUserDetails[];
  total_count: number;
}> => {
  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: IAllUserDetails[]; total_count: number }>
  >(APIS_ROUTES.GET_ALL_USER);

  return result.data.Data;
};

const useGetAllUserDetails = () =>
  useQuery<{ items: IAllUserDetails[]; total_count: number }, IAPIError>(
    [API_QUERY_KEY.GET_ALL_USER],
    getAllUserDetails,
    {
      cacheTime: 0,
    }
  );

export default useGetAllUserDetails;
