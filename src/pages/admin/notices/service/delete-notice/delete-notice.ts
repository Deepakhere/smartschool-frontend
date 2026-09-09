import { useMutation } from "@tanstack/react-query";

import apiClient from "../../../../../config";
import { IAPIError } from "../../../../../types";
import { API_MUTATION_KEY, APIS_ROUTES } from "../../../../../utils";

const deleteNotice = async (organizationId: string, noticeID: string) => {
  await apiClient.delete(`${APIS_ROUTES.SCHOOL_SERVICE}/notice/${organizationId}/delete-notice/${noticeID}`);
};

export const useDeleteNotice = (organizationId: string) =>
  useMutation<void, IAPIError, string>({
    mutationKey: [API_MUTATION_KEY.DELETE_NOTICE],
    mutationFn: (noticeID) => deleteNotice(organizationId, noticeID),
  });

export default useDeleteNotice;
