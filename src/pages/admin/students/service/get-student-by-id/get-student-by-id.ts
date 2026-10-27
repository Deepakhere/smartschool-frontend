import { useQuery } from "@tanstack/react-query";
import apiClient from "@/config";
import { IAPIError, IAxiosResponse, IStudentAdmissionDetails, IStudentEnrollment, IGuardian } from "@/types";
import { APIS_ROUTES, API_QUERY_KEY } from "@/utils";

export interface IStudentDetailResponse extends IStudentAdmissionDetails {
  id: string;
  name: string;
  admissionNumber: string;
  admissionDate: string;
  currentEnrollment: IStudentEnrollment | null;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  pincode?: string;
  parentName: string;
  parentEmail: string;
  phoneNumber: string;
  parentId: string;
  guardians: IGuardian[];
  // a short-lived signed link, or null
  photoUrl: string | null;
  status: "active" | "inactive" | "suspended";
}

const getStudentById = async (organizationId: string, studentId: string): Promise<{ item: IStudentDetailResponse }> => {
  const result = await apiClient.get<null, IAxiosResponse<{ item: IStudentDetailResponse }>>(
    `${APIS_ROUTES.STUDENT_PROFILE}/${organizationId}/get-student-by-id/${studentId}`
  );

  return result.data.Data;
};

const useGetStudentById = (organizationId: string, studentId: string) =>
  useQuery<{ item: IStudentDetailResponse }, IAPIError>({
    queryKey: [API_QUERY_KEY.GET_STUDENT_BY_ID, studentId],
    queryFn: () => getStudentById(organizationId, studentId),
    enabled: !!studentId,
  });

export default useGetStudentById;
