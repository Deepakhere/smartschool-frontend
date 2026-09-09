import { useMutation, useQueryClient } from "@tanstack/react-query";

import apiClient from "@/config";
import { IAPIError } from "@/types";
import { API_MUTATION_KEY, API_QUERY_KEY, APIS_ROUTES } from "@/utils";

const deleteNotice = async (organizationId: string, noticeID: string) => {
  await apiClient.delete(`${APIS_ROUTES.SCHOOL_SERVICE}/notice/${organizationId}/delete-notice/${noticeID}`);
};

export const useDeleteNotice = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, string>({
    mutationKey: [API_MUTATION_KEY.DELETE_NOTICE],
    mutationFn: (noticeID) => deleteNotice(organizationId, noticeID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_NOTICE_LIST, organizationId] });
      queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_MY_NOTICES] });
    },
  });
};

export default useDeleteNotice;
