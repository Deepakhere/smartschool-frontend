import apiClient from "@/config";
import { APIS_ROUTES, saveFile } from "@/utils";

// the filtered student list as a CSV built and capped by the server, in the upload template's columns
const downloadStudentsCsv = async (organizationId: string, classId: string, searchTerm: string, limit: number) => {
  const result = await apiClient.get(`${APIS_ROUTES.STUDENT_PROFILE}/${organizationId}/export-student-profile`, {
    params: { search_term: searchTerm || undefined, classId: classId === "all" ? undefined : classId || undefined, limit },
    responseType: "blob",
  });
  saveFile(result.data, "students.csv");
};

export default downloadStudentsCsv;
