import { useMutation } from "@tanstack/react-query";

import apiClient from "../../../../../config";
import { IAPIError } from "../../../../../types";
import { API_MUTATION_KEY, APIS_ROUTES } from "../../../../../utils";

const deleteStudent = async (organizationId: string, userId: string) => {
  await apiClient.delete(`${APIS_ROUTES.STUDENT_PROFILE}/${organizationId}/delete-student/${userId}`);
};

export const useDeleteStudent = (organizationId: string) =>
  useMutation<void, IAPIError, string>({
    mutationKey: [API_MUTATION_KEY.DELETE_USER],
    mutationFn: (userId) => deleteStudent(organizationId, userId),
  });

export default useDeleteStudent;
