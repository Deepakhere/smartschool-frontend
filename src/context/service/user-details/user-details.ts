import { useQuery } from "react-query";

import { IAPIError, IAxiosResponse, IUserDetailResponse } from "../../../types";

import Cookies from "js-cookie";
import { APIS_ROUTES, API_QUERY_KEY, USER_ACCESS_KEY } from "../../../utils";
import apiClient from "../../../config/api-client";

const getUserDetails = async (): Promise<IUserDetailResponse> => {
  const token = Cookies.get(USER_ACCESS_KEY.TOKEN);
  if (!token) {
    throw new Error("No token found");
  }
  const result = await apiClient.get<null, IAxiosResponse<IUserDetailResponse>>(
    APIS_ROUTES.GET_USER_DETAILS
  );

  return result.data.Data;
};

const useGetUserDetails = () =>
  useQuery<IUserDetailResponse, IAPIError>(
    [API_QUERY_KEY.GET_USER_DETAILS],
    getUserDetails,
    {
      cacheTime: 0,
    }
  );

export default useGetUserDetails;
