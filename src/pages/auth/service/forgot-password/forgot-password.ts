import { useMutation } from "react-query";

import apiClient from "../../../../config";
import { IAPIError, IForgetPasswordRequest } from "../../../../types";
import { API_MUTATION_KEY, APIS_ROUTES } from "../../../../utils";

const forgotPassword = async (forgotPasswordData: IForgetPasswordRequest) => {
  await apiClient.post(APIS_ROUTES.FORGOT_PASSWORD, forgotPasswordData);
};

export const useForgotPassword = () =>
  useMutation<void, IAPIError, IForgetPasswordRequest>(
    [API_MUTATION_KEY.FORGOT_PASSWORD],
    forgotPassword
  );

export default useForgotPassword;
