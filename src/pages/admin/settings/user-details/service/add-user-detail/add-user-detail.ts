import { useMutation, useQueryClient } from "@tanstack/react-query";

import apiClient from "@/config";
import { IAPIError, IAddUserValue } from "@/types";
import { API_MUTATION_KEY, API_QUERY_KEY, APIS_ROUTES } from "@/utils";

const addUser = async (organizationId: string, addUserValue: IAddUserValue) => {
  await apiClient.post(`${APIS_ROUTES.ADD_USER}/${organizationId}`, addUserValue);
};

export const useAddUserDetail = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, IAddUserValue>({
    mutationKey: [API_MUTATION_KEY.ADD_USER],
    mutationFn: (addUserValue) => addUser(organizationId, addUserValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_ALL_USER, organizationId] });
    },
  });
};

export default useAddUserDetail;
