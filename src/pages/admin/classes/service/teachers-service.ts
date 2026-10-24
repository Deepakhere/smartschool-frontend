import { useGetTeacherDirectory } from "@/pages/admin/teachers/service/teacher-directory-service";

// the staff teacher list is unpaged, so every teacher of the school can be picked
export const useGetAllTeachers = (organizationId: string) => useGetTeacherDirectory(organizationId);
