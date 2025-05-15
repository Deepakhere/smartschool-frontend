import { useMutation } from "react-query";

import apiClient from "../../../../../config";
import { IAPIError, IStudentFormData } from "../../../../../types";
import { API_MUTATION_KEY, APIS_ROUTES } from "../../../../../utils";

const updateStudent = async (
  organizationId: string,
  studentDetails: IStudentFormData
) => {
  await apiClient.put(
    `${APIS_ROUTES.STUDENT_PROFILE}/${organizationId}/edit-student-profile/${studentDetails.id}`,
    studentDetails
  );
};

export const useUpdateStudentDetail = (organizationId: string) =>
  useMutation<void, IAPIError, IStudentFormData>(
    [API_MUTATION_KEY.UPDATE_STUDENT_DETAILS],
    (values) => updateStudent(organizationId, values)
  );

export default useUpdateStudentDetail;
