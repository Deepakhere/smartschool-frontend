import { useMutation } from "react-query";

import apiClient from "../../../../../config";
import { IAPIError, IAddUserValue } from "../../../../../types";
import { API_MUTATION_KEY, APIS_ROUTES } from "../../../../../utils";

const addUser = async (organizationId: string, addUserValue: IAddUserValue) => {
  await apiClient.post(
    `${APIS_ROUTES.ADD_USER}/${organizationId}`,
    addUserValue
  );
};

export const useAddUserDetail = (organizationId: string) =>
  useMutation<void, IAPIError, IAddUserValue>(
    [API_MUTATION_KEY.ADD_USER],
    (addUserValue) => addUser(organizationId, addUserValue)
  );

export default useAddUserDetail;
