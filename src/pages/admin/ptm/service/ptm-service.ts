import { useMutation, useQuery, useQueryClient } from "react-query";

import apiClient from "../../../../config";
import { IAPIError, IAxiosResponse, IPTMEvent, IPTMSlot, IPTMBooking } from "../../../../types";
import { APIS_ROUTES, API_QUERY_KEY, API_MUTATION_KEY } from "../../../../utils";

const base = (organizationId: string) => `${APIS_ROUTES.PTM_SERVICE}/${organizationId}`;

export const useGetPTMEvents = (organizationId: string) =>
  useQuery<{ items: IPTMEvent[] }, IAPIError>(
    [API_QUERY_KEY.GET_PTM_EVENTS, organizationId],
    async () => {
      const result = await apiClient.get<null, IAxiosResponse<{ items: IPTMEvent[] }>>(`${base(organizationId)}/event`);
      return result.data.Data;
    },
    { enabled: !!organizationId, cacheTime: 0 }
  );

interface ICreatePTMEventPayload {
  academicYearId: string;
  title: string;
  date: string;
  mode: "onsite" | "online";
  venue?: string;
  defaultMeetingLink?: string;
  sectionIds: string[];
  slotDurationMins: number;
}

export const useCreatePTMEvent = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, ICreatePTMEventPayload>(
    [API_MUTATION_KEY.CREATE_PTM_EVENT],
    async (value) => {
      await apiClient.post(`${base(organizationId)}/event`, value);
    },
    { onSuccess: () => queryClient.invalidateQueries([API_QUERY_KEY.GET_PTM_EVENTS, organizationId]) }
  );
};

interface IGenerateSlotsPayload {
  ptmEventId: string;
  teacherUserId: string;
  sectionId: string;
  startAt: string;
  endAt: string;
}

export const useGenerateSlots = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, IGenerateSlotsPayload>(
    [API_MUTATION_KEY.GENERATE_PTM_SLOTS],
    async (value) => {
      await apiClient.post(`${base(organizationId)}/event/${value.ptmEventId}/slot/generate`, value);
    },
    {
      onSuccess: (_data, variables) =>
        queryClient.invalidateQueries([API_QUERY_KEY.GET_PTM_SLOTS, organizationId, variables.ptmEventId]),
    }
  );
};

export const useGetSlotsForEvent = (organizationId: string, ptmEventId?: string) =>
  useQuery<{ items: IPTMSlot[] }, IAPIError>(
    [API_QUERY_KEY.GET_PTM_SLOTS, organizationId, ptmEventId],
    async () => {
      const result = await apiClient.get<null, IAxiosResponse<{ items: IPTMSlot[] }>>(
        `${base(organizationId)}/event/${ptmEventId}/slot`
      );
      return result.data.Data;
    },
    { enabled: !!organizationId && !!ptmEventId, cacheTime: 0 }
  );

export const useBookPTMSlot = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, { slotId: string; studentId: string; parentNote?: string; ptmEventId: string }>(
    [API_MUTATION_KEY.BOOK_PTM_SLOT],
    async (value) => {
      await apiClient.post(`${base(organizationId)}/slot/${value.slotId}/book`, {
        studentId: value.studentId,
        parentNote: value.parentNote,
      });
    },
    {
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries([API_QUERY_KEY.GET_PTM_SLOTS, organizationId, variables.ptmEventId]);
        queryClient.invalidateQueries([API_QUERY_KEY.GET_MY_PTM_BOOKINGS, organizationId]);
      },
    }
  );
};

export const useCancelPTMBooking = (organizationId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void, IAPIError, string>(
    [API_MUTATION_KEY.CANCEL_PTM_BOOKING],
    async (bookingId) => {
      await apiClient.post(`${base(organizationId)}/booking/${bookingId}/cancel`);
    },
    { onSuccess: () => queryClient.invalidateQueries([API_QUERY_KEY.GET_MY_PTM_BOOKINGS, organizationId]) }
  );
};

export const useGetMyPTMBookings = (organizationId: string) =>
  useQuery<{ items: IPTMBooking[] }, IAPIError>(
    [API_QUERY_KEY.GET_MY_PTM_BOOKINGS, organizationId],
    async () => {
      const result = await apiClient.get<null, IAxiosResponse<{ items: IPTMBooking[] }>>(`${base(organizationId)}/my-bookings`);
      return result.data.Data;
    },
    { enabled: !!organizationId, cacheTime: 0 }
  );

export const useGetMyPTMAgenda = (organizationId: string) =>
  useQuery<{ items: { slot: IPTMSlot; booking: IPTMBooking | null }[] }, IAPIError>(
    [API_QUERY_KEY.GET_MY_PTM_AGENDA, organizationId],
    async () => {
      const result = await apiClient.get<null, IAxiosResponse<{ items: { slot: IPTMSlot; booking: IPTMBooking | null }[] }>>(
        `${base(organizationId)}/my-agenda`
      );
      return result.data.Data;
    },
    { enabled: !!organizationId, cacheTime: 0 }
  );
