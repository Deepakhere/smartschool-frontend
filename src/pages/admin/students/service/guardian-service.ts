import { useMutation, useQueryClient } from "@tanstack/react-query";

import apiClient from "@/config";
import { IAPIError, IAddGuardianValue } from "@/types";
import { API_QUERY_KEY, APIS_ROUTES } from "@/utils";

const base = (organizationId: string, studentId: string) =>
  `${APIS_ROUTES.STUDENT_PROFILE}/${organizationId}/student/${studentId}/guardian`;

export const useAddGuardian = (organizationId: string, studentId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, IAddGuardianValue>({
    mutationFn: async (value) => {
      await apiClient.post(base(organizationId, studentId), value);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_STUDENT_BY_ID, studentId] }),
  });
};

export const useSetPrimaryGuardian = (organizationId: string, studentId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, string>({
    mutationFn: async (guardianLinkId) => {
      await apiClient.put(`${base(organizationId, studentId)}/${guardianLinkId}`, { isPrimaryGuardian: true });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_STUDENT_BY_ID, studentId] }),
  });
};

export const useRemoveGuardian = (organizationId: string, studentId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, string>({
    mutationFn: async (guardianLinkId) => {
      await apiClient.delete(`${base(organizationId, studentId)}/${guardianLinkId}`);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_STUDENT_BY_ID, studentId] }),
  });
};
