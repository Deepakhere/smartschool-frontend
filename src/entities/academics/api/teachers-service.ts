import { useGetTeacherDirectory } from "@/entities/staff/api/teacher-directory-service";

// the staff teacher list is unpaged, so every teacher of the school can be picked
export const useGetAllTeachers = (organizationId: string) => useGetTeacherDirectory(organizationId);
