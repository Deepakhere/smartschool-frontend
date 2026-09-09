import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import apiClient from "../../../../config";
import {
  IAPIError,
  IAxiosResponse,
  IAcademicYear,
  IClass,
  ISection,
  ISubject,
  ITeacherAssignment,
} from "../../../../types";
import { APIS_ROUTES, API_QUERY_KEY, API_MUTATION_KEY } from "../../../../utils";

const base = (organizationId: string) => `${APIS_ROUTES.ACADEMIC_SERVICE}/${organizationId}`;

// academic years
export const useGetAcademicYears = (organizationId: string) =>
  useQuery<{ items: IAcademicYear[] }, IAPIError>({
    queryKey: [API_QUERY_KEY.GET_ACADEMIC_YEARS, organizationId],
    queryFn: async () => {
      const result = await apiClient.get<null, IAxiosResponse<{ items: IAcademicYear[] }>>(
        `${base(organizationId)}/academic-year`
      );
      return result.data.Data;
    },
    enabled: !!organizationId,
    gcTime: 0,
  });

export const useCreateAcademicYear = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, Partial<IAcademicYear>>({
    mutationKey: [API_MUTATION_KEY.CREATE_ACADEMIC_YEAR],
    mutationFn: async (value) => {
      await apiClient.post(`${base(organizationId)}/academic-year`, value);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_ACADEMIC_YEARS, organizationId] }),
  });
};

// classes
export const useGetClasses = (organizationId: string, academicYearId?: string) =>
  useQuery<{ items: IClass[] }, IAPIError>({
    queryKey: [API_QUERY_KEY.GET_CLASSES, organizationId, academicYearId],
    queryFn: async () => {
      const result = await apiClient.get<null, IAxiosResponse<{ items: IClass[] }>>(`${base(organizationId)}/class`, {
        params: { academicYearId },
      });
      return result.data.Data;
    },
    enabled: !!organizationId && !!academicYearId,
    gcTime: 0,
  });

export const useCreateClass = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, Partial<IClass>>({
    mutationKey: [API_MUTATION_KEY.CREATE_CLASS],
    mutationFn: async (value) => {
      await apiClient.post(`${base(organizationId)}/class`, value);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_CLASSES, organizationId] }),
  });
};

// sections
export const useGetSections = (organizationId: string, classId?: string) =>
  useQuery<{ items: ISection[] }, IAPIError>({
    queryKey: [API_QUERY_KEY.GET_SECTIONS, organizationId, classId],
    queryFn: async () => {
      const result = await apiClient.get<null, IAxiosResponse<{ items: ISection[] }>>(
        `${base(organizationId)}/section`,
        { params: { classId } }
      );
      return result.data.Data;
    },
    enabled: !!organizationId && !!classId,
    gcTime: 0,
  });

export const useCreateSection = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, Partial<ISection>>({
    mutationKey: [API_MUTATION_KEY.CREATE_SECTION],
    mutationFn: async (value) => {
      await apiClient.post(`${base(organizationId)}/section`, value);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_SECTIONS, organizationId] }),
  });
};

// subjects
export const useGetSubjects = (organizationId: string, academicYearId?: string) =>
  useQuery<{ items: ISubject[] }, IAPIError>({
    queryKey: [API_QUERY_KEY.GET_SUBJECTS, organizationId, academicYearId],
    queryFn: async () => {
      const result = await apiClient.get<null, IAxiosResponse<{ items: ISubject[] }>>(
        `${base(organizationId)}/subject`,
        { params: { academicYearId } }
      );
      return result.data.Data;
    },
    enabled: !!organizationId && !!academicYearId,
    gcTime: 0,
  });

export const useCreateSubject = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, Partial<ISubject>>({
    mutationKey: [API_MUTATION_KEY.CREATE_SUBJECT],
    mutationFn: async (value) => {
      await apiClient.post(`${base(organizationId)}/subject`, value);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_SUBJECTS, organizationId] }),
  });
};

// teacher assignments
export const useGetTeacherAssignments = (organizationId: string, classId?: string) =>
  useQuery<{ items: ITeacherAssignment[] }, IAPIError>({
    queryKey: [API_QUERY_KEY.GET_TEACHER_ASSIGNMENTS, organizationId, classId],
    queryFn: async () => {
      const result = await apiClient.get<null, IAxiosResponse<{ items: ITeacherAssignment[] }>>(
        `${base(organizationId)}/teacher-assignment`
      );
      return result.data.Data;
    },
    enabled: !!organizationId,
    gcTime: 0,
  });

export const useAssignTeacher = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<
    void,
    IAPIError,
    {
      teacherUserId: string;
      academicYearId: string;
      classId: string;
      sectionId: string;
      subjectId?: string;
      assignmentRole: string;
    }
  >({
    mutationKey: [API_MUTATION_KEY.ASSIGN_TEACHER],
    mutationFn: async (value) => {
      await apiClient.post(`${base(organizationId)}/teacher-assignment`, value);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_TEACHER_ASSIGNMENTS, organizationId] });
      queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_SECTIONS, organizationId] });
    },
  });
};
