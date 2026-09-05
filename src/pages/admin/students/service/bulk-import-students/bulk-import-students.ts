import { useMutation } from "react-query";

import apiClient from "../../../../../config";
import { IAPIError, IAxiosResponse } from "../../../../../types";
import { APIS_ROUTES } from "../../../../../utils";

export interface IBulkImportResult {
  createdCount: number;
  failed: { row: number; name: string; reason: string }[];
}

interface IBulkImportValue {
  academicYearId: string;
  classId: string;
  sectionId: string;
  file: File;
}

const bulkImportStudents = async (organizationId: string, value: IBulkImportValue) => {
  const formData = new FormData();
  formData.append("academicYearId", value.academicYearId);
  formData.append("classId", value.classId);
  formData.append("sectionId", value.sectionId);
  formData.append("file", value.file);

  const result = await apiClient.post<null, IAxiosResponse<{ item: IBulkImportResult }>>(
    `${APIS_ROUTES.STUDENT_PROFILE}/${organizationId}/bulk-import-students`,
    formData
  );

  return result.data.Data.item;
};

const useBulkImportStudents = (organizationId: string) =>
  useMutation<IBulkImportResult, IAPIError, IBulkImportValue>((value) => bulkImportStudents(organizationId, value));

export default useBulkImportStudents;
