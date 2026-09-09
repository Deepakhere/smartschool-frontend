import { useMutation } from "@tanstack/react-query";

import apiClient from "@/config";
import { IAPIError, IAxiosResponse } from "@/types";
import { API_MUTATION_KEY, APIS_ROUTES } from "@/utils";

interface IChangeMyPasswordPayload {
  currentPassword: string;
  newPassword: string;
}

const changeMyPassword = async (payload: IChangeMyPasswordPayload): Promise<void> => {
  await apiClient.put<null, IAxiosResponse<{ message: string }>>(APIS_ROUTES.CHANGE_MY_PASSWORD, payload);
};

export const useChangeMyPassword = () =>
  useMutation<void, IAPIError, IChangeMyPasswordPayload>({
    mutationKey: [API_MUTATION_KEY.CHANGE_MY_PASSWORD],
    mutationFn: changeMyPassword,
  });

export default useChangeMyPassword;
