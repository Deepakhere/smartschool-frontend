import { useMutation } from "react-query";

import apiClient from "../../../../../config";
import { IAPIError } from "../../../../../types";
import { API_MUTATION_KEY, APIS_ROUTES } from "../../../../../utils";

const deleteUser = async (organizationId: string, userId: string) => {
  await apiClient.delete(
    `${APIS_ROUTES.DELETE_USER}/${organizationId}/user/${userId}`
  );
};

export const useDeleteUser = (organizationId: string) =>
  useMutation<void, IAPIError, string>(
    [API_MUTATION_KEY.DELETE_USER],
    (userId) => deleteUser(organizationId, userId)
  );

export default useDeleteUser;
