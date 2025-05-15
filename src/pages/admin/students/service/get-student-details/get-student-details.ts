import { useQuery } from "react-query";

import { IAPIError, IAxiosResponse } from "../../../../../types";
import { APIS_ROUTES, API_QUERY_KEY } from "../../../../../utils";
import apiClient from "../../../../../config";

interface IStudentResponse {
  id: string;
  name: string;
  classId: string;
  rollNumber: string;
  parentId: string;
  dateOfBirth: string;
}

const getStudentDetails = async (
  organizationId: string,
  classId: string,
  searchTerm: string,
  limit: number,
  page: number
): Promise<{ items: IStudentResponse[]; total_count: number }> => {
  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: IStudentResponse[]; total_count: number }>
  >(`${APIS_ROUTES.STUDENT_PROFILE}/${organizationId}/get-student-profile`, {
    params: {
      search_term: searchTerm,
      classId: classId === "all" ? "" : classId,
      limit: limit,
      page: page,
    },
  });

  return result.data.Data;
};

const useGetStudentDetails = (
  organizationId: string,
  classId: string,
  searchTerm: string,
  limit: number,
  page: number
) =>
  useQuery<{ items: IStudentResponse[]; total_count: number }, IAPIError>(
    [API_QUERY_KEY.GET_STUDENT_PROFILE],
    () => getStudentDetails(organizationId, classId, searchTerm, limit, page),
    {
      cacheTime: 0,
    }
  );

export default useGetStudentDetails;
