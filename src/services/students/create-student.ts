import { useMutation } from "@tanstack/react-query";
import apiClient from "../../config";

interface ICreateStudentRequest {
  name: string;
  classId: string;
  rollNumber: string;
  parentId: string;
  dateOfBirth: string;
}

interface ICreateStudentResponse {
  id: string;
  name: string;
  classId: string;
  rollNumber: string;
  parentId: string;
  dateOfBirth: string;
}

const createStudent = async (
  data: ICreateStudentRequest
): Promise<ICreateStudentResponse> => {
  const response = await apiClient.post("/students", data);
  return response.data;
};

export const useCreateStudent = () => {
  return useMutation({
    mutationFn: createStudent,
  });
};

export { createStudent };
