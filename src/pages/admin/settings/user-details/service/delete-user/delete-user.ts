import { useMutation, useQueryClient } from "@tanstack/react-query";

import apiClient from "@/config";
import { IAPIError, IAxiosResponse } from "@/types";
import { API_MUTATION_KEY, API_QUERY_KEY, APIS_ROUTES } from "@/utils";

// the server says whether the account was deleted or only taken out of this school (they belong to another)
const deleteUser = async (organizationId: string, userId: string) => {
  const result = await apiClient.delete<null, IAxiosResponse<{ message: string }>>(
    `${APIS_ROUTES.DELETE_USER}/${organizationId}/user/${userId}`
  );
  return result.data.Data.message;
};

export const useDeleteUser = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<string, IAPIError, string>({
    mutationKey: [API_MUTATION_KEY.DELETE_USER],
    mutationFn: (userId) => deleteUser(organizationId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_ALL_USER, organizationId] });
    },
  });
};

export default useDeleteUser;
