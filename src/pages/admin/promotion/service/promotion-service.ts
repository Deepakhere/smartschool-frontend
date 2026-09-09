import { useQuery, useMutation } from "@tanstack/react-query";

import apiClient from "../../../../config";
import {
  IAPIError,
  IAxiosResponse,
  IPromotionCandidate,
  IPromotionDecisionResult,
  PromotionAction,
} from "../../../../types";
import { APIS_ROUTES, API_QUERY_KEY } from "../../../../utils";

const base = (organizationId: string) => `${APIS_ROUTES.STUDENT_PROFILE}/${organizationId}`;

export const useGetPromotionCandidates = (organizationId: string, academicYearId: string, sectionId: string) =>
  useQuery<{ items: IPromotionCandidate[] }, IAPIError>({
    queryKey: [API_QUERY_KEY.GET_PROMOTION_CANDIDATES, organizationId, academicYearId, sectionId],
    queryFn: async () => {
      const result = await apiClient.get<null, IAxiosResponse<{ items: IPromotionCandidate[] }>>(
        `${base(organizationId)}/promotion/candidates`,
        { params: { academicYearId, sectionId } }
      );
      return result.data.Data;
    },
    enabled: !!organizationId && !!academicYearId && !!sectionId,
  });

export interface IPromotionDecisionInput {
  studentId: string;
  action: PromotionAction;
  academicYearId?: string;
  classId?: string;
  sectionId?: string;
  rollNumber?: string;
}

export const useProcessPromotions = (organizationId: string) =>
  useMutation<{ items: IPromotionDecisionResult[] }, IAPIError, IPromotionDecisionInput[]>({
    mutationFn: async (decisions) => {
      const result = await apiClient.post<
        { decisions: IPromotionDecisionInput[] },
        IAxiosResponse<{ items: IPromotionDecisionResult[] }>
      >(`${base(organizationId)}/promotion/process`, { decisions });
      return result.data.Data;
    },
  });
