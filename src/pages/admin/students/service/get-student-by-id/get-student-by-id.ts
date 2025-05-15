import { useQuery } from "react-query";
import apiClient from "../../../../../config";
import { IAPIError, IAxiosResponse } from "../../../../../types";
import { APIS_ROUTES, API_QUERY_KEY } from "../../../../../utils";

interface IStudentDetailResponse {
  id: string;
  name: string;
  admissionId: string;
  admissionDate: string;
  classId: string;
  rollNumber: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  parentName: string;
  parentEmail: string;
  phoneNumber: string;
  parentId: string;
}

const getStudentById = async (
  organizationId: string,
  studentId: string
): Promise<{ item: IStudentDetailResponse }> => {
  const result = await apiClient.get<
    null,
    IAxiosResponse<{ item: IStudentDetailResponse }>
  >(
    `${APIS_ROUTES.STUDENT_PROFILE}/${organizationId}/get-student-by-id/${studentId}`
  );

  return result.data.Data;
};

const useGetStudentById = (organizationId: string, studentId: string) =>
  useQuery<{ item: IStudentDetailResponse }, IAPIError>(
    [API_QUERY_KEY.GET_STUDENT_BY_ID, studentId],
    () => getStudentById(organizationId, studentId),
    {
      enabled: !!studentId,
      refetchOnWindowFocus: false,
    }
  );

export default useGetStudentById;
