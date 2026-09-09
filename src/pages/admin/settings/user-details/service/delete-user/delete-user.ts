import { useMutation, useQueryClient } from "@tanstack/react-query";

import apiClient from "@/config";
import { IAPIError } from "@/types";
import { API_MUTATION_KEY, API_QUERY_KEY, APIS_ROUTES } from "@/utils";

const deleteUser = async (organizationId: string, userId: string) => {
  await apiClient.delete(`${APIS_ROUTES.DELETE_USER}/${organizationId}/user/${userId}`);
};

export const useDeleteUser = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, string>({
    mutationKey: [API_MUTATION_KEY.DELETE_USER],
    mutationFn: (userId) => deleteUser(organizationId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_ALL_USER, organizationId] });
    },
  });
};

export default useDeleteUser;
