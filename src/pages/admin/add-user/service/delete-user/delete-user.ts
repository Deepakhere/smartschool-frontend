import { useMutation } from "react-query";

import apiClient from "../../../../../config";
import { IAPIError } from "../../../../../types";
import { API_MUTATION_KEY, APIS_ROUTES } from "../../../../../utils";

const deleteUser = async (userId: string) => {
  await apiClient.delete(`${APIS_ROUTES.DELETE_USER}/${userId}`);
};

export const useDeleteUser = () =>
  useMutation<void, IAPIError, string>(
    [API_MUTATION_KEY.DELETE_USER],
    deleteUser
  );

export default useDeleteUser;
