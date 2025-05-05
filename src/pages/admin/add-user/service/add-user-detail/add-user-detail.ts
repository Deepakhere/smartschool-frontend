import { useMutation } from "react-query";

import apiClient from "../../../../../config";
import { IAPIError, IAddUserValue } from "../../../../../types";
import { API_MUTATION_KEY, APIS_ROUTES } from "../../../../../utils";

const addUser = async (addUserValue: IAddUserValue) => {
  await apiClient.post(APIS_ROUTES.ADD_USER, addUserValue);
};

export const useAddUserDetail = () =>
  useMutation<void, IAPIError, IAddUserValue>(
    [API_MUTATION_KEY.ADD_USER],
    addUser
  );

export default useAddUserDetail;
