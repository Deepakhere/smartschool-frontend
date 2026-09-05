import useGetAllUserDetails from "../../settings/user-details/service/get-all-user-details";

export const useGetAllTeachers = (organizationId: string) =>
  useGetAllUserDetails(organizationId, "", "teacher");
