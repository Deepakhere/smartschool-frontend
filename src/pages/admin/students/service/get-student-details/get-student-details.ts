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

const getStudentDetails = async (): Promise<{ items: IStudentResponse[] }> => {
  const result = await apiClient.get<
    null,
    IAxiosResponse<{ items: IStudentResponse[] }>
  >(APIS_ROUTES.GET_STUDENT_DETAILS);

  return result.data.Data;
};

const useGetStudentDetails = () =>
  useQuery<{ items: IStudentResponse[] }, IAPIError>(
    [API_QUERY_KEY.GET_STUDENT_DETAILS],
    getStudentDetails,
    {
      cacheTime: 0,
    }
  );

export default useGetStudentDetails;
