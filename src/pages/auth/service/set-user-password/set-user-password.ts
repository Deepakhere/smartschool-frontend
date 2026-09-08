import { useMutation } from "react-query";

import apiClient from "../../../../config";
import { IAPIError } from "../../../../types";
import { API_MUTATION_KEY, APIS_ROUTES } from "../../../../utils";

interface ISetUserPasswordRequest {
  token: string;
  password: string;
}

const setUserPassword = async (value: ISetUserPasswordRequest) => {
  await apiClient.put(APIS_ROUTES.SET_USER_PASSWORD, value);
};

export const useSetUserPassword = () =>
  useMutation<void, IAPIError, ISetUserPasswordRequest>([API_MUTATION_KEY.SET_USER_PASSWORD], setUserPassword);

export default useSetUserPassword;
