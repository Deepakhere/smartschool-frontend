import { useMutation, useQuery, useQueryClient } from "react-query";

import apiClient from "../../../../config";
import {
  IAPIError,
  IAxiosResponse,
  IGradingScheme,
  IExam,
  IExamSubject,
  IMarksSheetItem,
  IResult,
} from "../../../../types";
import { APIS_ROUTES, API_QUERY_KEY, API_MUTATION_KEY } from "../../../../utils";

const base = (organizationId: string) => `${APIS_ROUTES.EXAM_SERVICE}/${organizationId}`;

export const useGetGradingSchemes = (organizationId: string) =>
  useQuery<{ items: IGradingScheme[] }, IAPIError>(
    [API_QUERY_KEY.GET_GRADING_SCHEMES, organizationId],
    async () => {
      const result = await apiClient.get<null, IAxiosResponse<{ items: IGradingScheme[] }>>(
        `${base(organizationId)}/grading-scheme`
      );
      return result.data.Data;
    },
    { enabled: !!organizationId, cacheTime: 0 }
  );

interface ICreateGradingSchemePayload {
  name: string;
  passPercent: number;
  bands: { grade: string; minPercent: number; maxPercent: number; gradePoint: number }[];
}

export const useCreateGradingScheme = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, ICreateGradingSchemePayload>(
    [API_MUTATION_KEY.CREATE_GRADING_SCHEME],
    async (value) => {
      await apiClient.post(`${base(organizationId)}/grading-scheme`, value);
    },
    { onSuccess: () => queryClient.invalidateQueries([API_QUERY_KEY.GET_GRADING_SCHEMES, organizationId]) }
  );
};

export const useGetExams = (organizationId: string) =>
  useQuery<{ items: IExam[] }, IAPIError>(
    [API_QUERY_KEY.GET_EXAMS, organizationId],
    async () => {
      const result = await apiClient.get<null, IAxiosResponse<{ items: IExam[] }>>(`${base(organizationId)}/exam`);
      return result.data.Data;
    },
    { enabled: !!organizationId, cacheTime: 0 }
  );

interface ICreateExamPayload {
  academicYearId: string;
  name: string;
  term: string;
  type: string;
  startDate: string;
  endDate: string;
  classIds: string[];
  gradingSchemeId: string;
}

export const useCreateExam = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, ICreateExamPayload>(
    [API_MUTATION_KEY.CREATE_EXAM],
    async (value) => {
      await apiClient.post(`${base(organizationId)}/exam`, value);
    },
    { onSuccess: () => queryClient.invalidateQueries([API_QUERY_KEY.GET_EXAMS, organizationId]) }
  );
};

interface IAddExamSubjectsPayload {
  examId: string;
  classId: string;
  subjects: {
    subjectId: string;
    maxMarks: number;
    passMarks: number;
    hasPractical?: boolean;
    practicalMaxMarks?: number;
  }[];
}

export const useAddExamSubjects = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, IAddExamSubjectsPayload>(
    [API_MUTATION_KEY.ADD_EXAM_SUBJECTS],
    async (value) => {
      await apiClient.post(`${base(organizationId)}/exam/${value.examId}/subject`, value);
    },
    {
      onSuccess: (_data, variables) =>
        queryClient.invalidateQueries([API_QUERY_KEY.GET_EXAM_SUBJECTS, organizationId, variables.examId]),
    }
  );
};

export const useGetExamSubjects = (organizationId: string, examId?: string, classId?: string) =>
  useQuery<{ items: IExamSubject[] }, IAPIError>(
    [API_QUERY_KEY.GET_EXAM_SUBJECTS, organizationId, examId, classId],
    async () => {
      const result = await apiClient.get<null, IAxiosResponse<{ items: IExamSubject[] }>>(
        `${base(organizationId)}/exam/${examId}/subject`,
        { params: classId ? { classId } : undefined }
      );
      return result.data.Data;
    },
    { enabled: !!organizationId && !!examId, cacheTime: 0 }
  );

export const useGetMarksSheet = (organizationId: string, examSubjectId?: string, sectionId?: string) =>
  useQuery<{ items: IMarksSheetItem[]; examSubject: IExamSubject }, IAPIError>(
    [API_QUERY_KEY.GET_MARKS_SHEET, organizationId, examSubjectId, sectionId],
    async () => {
      const result = await apiClient.get<
        null,
        IAxiosResponse<{ items: IMarksSheetItem[]; examSubject: IExamSubject }>
      >(`${base(organizationId)}/exam-subject/${examSubjectId}/marks-sheet`, { params: { sectionId } });
      return result.data.Data;
    },
    { enabled: !!organizationId && !!examSubjectId && !!sectionId, cacheTime: 0 }
  );

interface ISaveMarksPayload {
  examSubjectId: string;
  sectionId: string;
  entries: { studentId: string; theoryMarks: number; practicalMarks?: number; isAbsent?: boolean }[];
}

export const useSaveMarks = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, ISaveMarksPayload>(
    [API_MUTATION_KEY.SAVE_MARKS],
    async (value) => {
      await apiClient.post(`${base(organizationId)}/exam-subject/${value.examSubjectId}/marks`, value);
    },
    {
      onSuccess: (_data, variables) =>
        queryClient.invalidateQueries([
          API_QUERY_KEY.GET_MARKS_SHEET,
          organizationId,
          variables.examSubjectId,
          variables.sectionId,
        ]),
    }
  );
};

export const useVerifyExamSubjectMarks = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, string>(
    [API_MUTATION_KEY.VERIFY_EXAM_SUBJECT_MARKS],
    async (examSubjectId) => {
      await apiClient.post(`${base(organizationId)}/exam-subject/${examSubjectId}/verify`);
    },
    { onSuccess: () => queryClient.invalidateQueries([API_QUERY_KEY.GET_MARKS_SHEET, organizationId]) }
  );
};

export const usePublishExam = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, string>(
    [API_MUTATION_KEY.PUBLISH_EXAM],
    async (examId) => {
      await apiClient.post(`${base(organizationId)}/exam/${examId}/publish`);
    },
    { onSuccess: () => queryClient.invalidateQueries([API_QUERY_KEY.GET_EXAMS, organizationId]) }
  );
};

export const useGetResultsForStudent = (organizationId: string, studentId?: string) =>
  useQuery<{ items: IResult[] }, IAPIError>(
    [API_QUERY_KEY.GET_RESULTS_FOR_STUDENT, organizationId, studentId],
    async () => {
      const result = await apiClient.get<null, IAxiosResponse<{ items: IResult[] }>>(
        `${base(organizationId)}/student/${studentId}/results`
      );
      return result.data.Data;
    },
    { enabled: !!organizationId && !!studentId, cacheTime: 0 }
  );

export const useGetMyResults = (organizationId: string) =>
  useQuery<{ items: { studentId: string; studentName: string; results: IResult[] }[] }, IAPIError>(
    [API_QUERY_KEY.GET_MY_RESULTS, organizationId],
    async () => {
      const result = await apiClient.get<
        null,
        IAxiosResponse<{ items: { studentId: string; studentName: string; results: IResult[] }[] }>
      >(`${base(organizationId)}/my-results`);
      return result.data.Data;
    },
    { enabled: !!organizationId, cacheTime: 0 }
  );
