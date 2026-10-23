import { useQuery } from "@tanstack/react-query";

import { IAPIError, IAxiosResponse, IStudentEnrollment, Paged } from "@/types";
import { APIS_ROUTES, API_QUERY_KEY } from "@/utils";
import apiClient from "@/config";

interface IStudentResponse {
  id: string;
  name: string;
  currentEnrollment: IStudentEnrollment | null;
  parentId: string | { id?: string; name?: string; email?: string; phoneNumber?: string; status?: string } | null;
  dateOfBirth: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export const fetchStudentsPage = async (
  organizationId: string,
  classId: string,
  searchTerm: string,
  limit: number,
  page: number
): Promise<Paged<IStudentResponse>> => {
  const result = await apiClient.get<null, IAxiosResponse<Paged<IStudentResponse>>>(
    `${APIS_ROUTES.STUDENT_PROFILE}/${organizationId}/get-student-profile`,
    {
      params: {
        search_term: searchTerm,
        classId: classId === "all" ? "" : classId,
        limit: limit,
        page: page,
      },
    }
  );

  return result.data.Data;
};

const useGetStudentDetails = (
  organizationId: string,
  classId: string,
  searchTerm: string,
  limit: number,
  page: number
) =>
  useQuery<Paged<IStudentResponse>, IAPIError>({
    queryKey: [API_QUERY_KEY.GET_STUDENT_PROFILE, organizationId, classId, searchTerm, limit, page],
    queryFn: () => fetchStudentsPage(organizationId, classId, searchTerm, limit, page),
    enabled: !!organizationId,
  });

export default useGetStudentDetails;
