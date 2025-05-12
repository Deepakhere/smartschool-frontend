import { useMutation } from "react-query";
import apiClient from "../../../../../config";
import {
  IAPIError,
  IAxiosResponse,
  IStudentFormData,
} from "../../../../../types";
import { API_MUTATION_KEY, APIS_ROUTES } from "../../../../../utils";

interface IAddStudentResponse {
  id: string;
  name: string;
  classId: string;
  rollNumber: string;
  parentId: string;
  dateOfBirth: string;
}

const addStudent = async (organizationId: string, data: IStudentFormData) => {
  const response = await apiClient.post<
    IStudentFormData,
    IAxiosResponse<IAddStudentResponse>
  >(
    `${APIS_ROUTES.STUDENT_PROFILE}/${organizationId}/add-student-profile`,
    data
  );

  return response.data.Data;
};

const useAddStudent = (organizationId: string) => {
  return useMutation<IAddStudentResponse, IAPIError, IStudentFormData>(
    [API_MUTATION_KEY.ADD_STUDENT_PROFILE],
    (data: IStudentFormData) => addStudent(organizationId, data)
  );
};

export default useAddStudent;
