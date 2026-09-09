import { useMutation } from "@tanstack/react-query";

import apiClient from "@/config";
import { IAPIError, ILoginResponse, IAxiosResponse } from "@/types";
import { API_MUTATION_KEY, APIS_ROUTES } from "@/utils";

interface ILoginValue {
  email: string;
  password: string;
}

const singIn = async (value: ILoginValue) => {
  const response = await apiClient.post<ILoginValue, IAxiosResponse<ILoginResponse>>(APIS_ROUTES.SIGNIN, value);

  return response.data.Data;
};

const useSignIn = () =>
  useMutation<ILoginResponse, IAPIError, ILoginValue>({
    mutationKey: [API_MUTATION_KEY.SIGNIN],
    mutationFn: singIn,
  });

export default useSignIn;
