import { useMutation } from "react-query";

import apiClient from "../../../../../../config";
import { IAPIError, IAxiosResponse, IUserPreferences } from "../../../../../../types";
import { API_MUTATION_KEY, APIS_ROUTES } from "../../../../../../utils";

type UpdatePreferencesPayload = Partial<IUserPreferences>;

const updateUserPreferences = async (
  payload: UpdatePreferencesPayload
): Promise<IUserPreferences> => {
  const result = await apiClient.patch<
    null,
    IAxiosResponse<{ item: IUserPreferences }>
  >(APIS_ROUTES.UPDATE_USER_PREFERENCES, payload);

  return result.data.Data.item;
};

export const useUpdateUserPreferences = () =>
  useMutation<IUserPreferences, IAPIError, UpdatePreferencesPayload>(
    [API_MUTATION_KEY.UPDATE_USER_PREFERENCES],
    updateUserPreferences
  );

export default useUpdateUserPreferences;
