import { useQuery } from "@tanstack/react-query";
import apiClient from "../../config";

interface IStudent {
  id: string;
  name: string;
  classId: string;
  rollNumber: string;
  parentId: string;
  dateOfBirth: string;
}

const getStudents = async (): Promise<IStudent[]> => {
  const response = await apiClient.get("/students");
  return response.data;
};

export const useGetStudents = () => {
  return useQuery<IStudent[]>({
    queryKey: ['students'],
    queryFn: getStudents,
  });
};

export { getStudents }; 