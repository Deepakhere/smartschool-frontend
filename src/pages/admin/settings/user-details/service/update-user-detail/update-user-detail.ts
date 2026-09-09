import { useMutation, useQueryClient } from "@tanstack/react-query";

import apiClient from "@/config";
import { IAPIError, IUpdateUserValue } from "@/types";
import { API_MUTATION_KEY, API_QUERY_KEY, APIS_ROUTES } from "@/utils";

const updateUser = async (updateUserValue: IUpdateUserValue) => {
  await apiClient.put(`${APIS_ROUTES.UPDATE_USER_DETAILS}/${updateUserValue.id}`, updateUserValue);
};

export const useUpdateUserDetail = (organizationId?: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, IUpdateUserValue>({
    mutationKey: [API_MUTATION_KEY.UPDATE_USER_DETAILS],
    mutationFn: updateUser,
    onSuccess: () => {
      if (organizationId) {
        queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_ALL_USER, organizationId] });
      }
    },
  });
};

export default useUpdateUserDetail;
