import { useMutation } from "react-query";
import apiClient from "../../../../../config";
import { IAPIError, IAxiosResponse } from "../../../../../types";
import { API_MUTATION_KEY, APIS_ROUTES } from "../../../../../utils";

interface IAddStudentRequest {
  name: string;
  classId: string;
  rollNumber: string;
  parentId: string;
  dateOfBirth: string;
}

interface IAddStudentResponse {
  id: string;
  name: string;
  classId: string;
  rollNumber: string;
  parentId: string;
  dateOfBirth: string;
}

const addStudent = async (data: IAddStudentRequest) => {
  const response = await apiClient.post<
    IAddStudentRequest,
    IAxiosResponse<IAddStudentResponse>
  >(APIS_ROUTES.ADD_STUDENT, data);

  return response.data.Data;
};

const useAddStudent = () => {
  return useMutation<IAddStudentResponse, IAPIError, IAddStudentRequest>(
    [API_MUTATION_KEY.ADD_STUDENT],
    addStudent
  );
};

export default useAddStudent;
