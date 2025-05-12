import { useMutation } from "react-query";

import apiClient from "../../../../../config";
import { IAPIError, IStudentDetails } from "../../../../../types";
import { API_MUTATION_KEY, APIS_ROUTES } from "../../../../../utils";

const updateStudent = async (studentDetails: IStudentDetails) => {
  await apiClient.put(
    `${APIS_ROUTES.UPDATE_STUDENT_DETAILS}/${studentDetails.id}`,
    studentDetails
  );
};

export const useUpdateStudentDetail = () =>
  useMutation<void, IAPIError, IStudentDetails>(
    [API_MUTATION_KEY.UPDATE_STUDENT_DETAILS],
    updateStudent
  );

export default useUpdateStudentDetail;
