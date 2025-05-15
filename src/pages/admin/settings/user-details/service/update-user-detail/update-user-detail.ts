import { useMutation } from "react-query";

import apiClient from "../../../../../../config";
import { IAPIError, IUpdateUserValue } from "../../../../../../types";
import { API_MUTATION_KEY, APIS_ROUTES } from "../../../../../../utils";

const updateUser = async (updateUserValue: IUpdateUserValue) => {
  await apiClient.put(
    `${APIS_ROUTES.UPDATE_USER_DETAILS}/${updateUserValue.id}`,
    updateUserValue
  );
};

export const useUpdateUserDetail = () =>
  useMutation<void, IAPIError, IUpdateUserValue>(
    [API_MUTATION_KEY.UPDATE_USER_DETAILS],
    updateUser
  );

export default useUpdateUserDetail;
