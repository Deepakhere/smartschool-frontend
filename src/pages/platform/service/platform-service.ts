import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import apiClient from "../../../config";
import {
  IAPIError,
  IAxiosResponse,
  IAccount,
  ICreateAccountValue,
  IAddOrganizationToAccountValue,
  IOrganization,
} from "../../../types";
import { API_QUERY_KEY, API_MUTATION_KEY } from "../../../utils";

const base = "/platform-service/v1";

export const useGetAccounts = () =>
  useQuery<{ items: IAccount[] }, IAPIError>({
    queryKey: [API_QUERY_KEY.GET_ALL_ACCOUNTS],
    queryFn: async () => {
      const result = await apiClient.get<null, IAxiosResponse<{ items: IAccount[] }>>(`${base}/accounts`);
      return result.data.Data;
    },
    gcTime: 0,
  });

export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation<
    { account: IAccount; organization: IOrganization; ownerInvited: boolean },
    IAPIError,
    ICreateAccountValue
  >({
    mutationKey: [API_MUTATION_KEY.CREATE_ACCOUNT],
    mutationFn: async (value) => {
      const result = await apiClient.post<
        ICreateAccountValue,
        IAxiosResponse<{ item: { account: IAccount; organization: IOrganization; ownerInvited: boolean } }>
      >(`${base}/accounts`, value);
      return result.data.Data.item;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_ALL_ACCOUNTS] }),
  });
};

export const useAddOrganizationToAccount = (accountId: string) => {
  const queryClient = useQueryClient();
  return useMutation<IOrganization, IAPIError, IAddOrganizationToAccountValue>({
    mutationKey: [API_MUTATION_KEY.ADD_ORGANIZATION_TO_ACCOUNT],
    mutationFn: async (value) => {
      const result = await apiClient.post<IAddOrganizationToAccountValue, IAxiosResponse<{ item: IOrganization }>>(
        `${base}/accounts/${accountId}/organizations`,
        value
      );
      return result.data.Data.item;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_ALL_ACCOUNTS] }),
  });
};

export const useUpdateAccountStatus = () => {
  const queryClient = useQueryClient();
  return useMutation<IAccount, IAPIError, { accountId: string; status: "active" | "trial" | "suspended" }>({
    mutationKey: [API_MUTATION_KEY.UPDATE_ACCOUNT_STATUS],
    mutationFn: async ({ accountId, status }) => {
      const result = await apiClient.patch<{ status: string }, IAxiosResponse<{ item: IAccount }>>(
        `${base}/accounts/${accountId}/status`,
        { status }
      );
      return result.data.Data.item;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [API_QUERY_KEY.GET_ALL_ACCOUNTS] }),
  });
};
