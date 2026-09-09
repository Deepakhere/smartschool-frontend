import { useMutation } from "@tanstack/react-query";

import apiClient from "@/config";
import { IAPIError, IAxiosResponse } from "@/types";
import { API_MUTATION_KEY, APIS_ROUTES } from "@/utils";

interface IUpdateMyProfilePayload {
  name: string;
  phoneNumber?: string;
}

interface IUpdateMyProfileResponse {
  name: string;
  phoneNumber: string;
}

const updateMyProfile = async (payload: IUpdateMyProfilePayload): Promise<IUpdateMyProfileResponse> => {
  const result = await apiClient.patch<null, IAxiosResponse<{ item: IUpdateMyProfileResponse }>>(
    APIS_ROUTES.UPDATE_MY_PROFILE,
    payload
  );

  return result.data.Data.item;
};

export const useUpdateMyProfile = () =>
  useMutation<IUpdateMyProfileResponse, IAPIError, IUpdateMyProfilePayload>({
    mutationKey: [API_MUTATION_KEY.UPDATE_MY_PROFILE],
    mutationFn: updateMyProfile,
  });

export default useUpdateMyProfile;
