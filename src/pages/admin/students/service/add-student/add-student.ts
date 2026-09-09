import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/config";
import { IAPIError, IAxiosResponse, IStudentFormData } from "@/types";
import { API_MUTATION_KEY, API_QUERY_KEY, APIS_ROUTES } from "@/utils";

interface IAddStudentResponse {
  id: string;
  name: string;
  classId: string;
  rollNumber: string;
  parentId: string;
  dateOfBirth: string;
}

const addStudent = async (organizationId: string, data: IStudentFormData) => {
  const response = await apiClient.post<IStudentFormData, IAxiosResponse<IAddStudentResponse>>(
    `${APIS_ROUTES.STUDENT_PROFILE}/${organizationId}/add-student-profile`,
    data
  );

  return response.data.Data;
};

const useAddStudent = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<IAddStudentResponse, IAPIError, IStudentFormData>({
    mutationKey: [API_MUTATION_KEY.ADD_STUDENT_PROFILE],
    mutationFn: (data: IStudentFormData) => addStudent(organizationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_STUDENT_PROFILE, organizationId] });
    },
  });
};

export default useAddStudent;
