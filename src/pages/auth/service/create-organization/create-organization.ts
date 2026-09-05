import { useMutation } from "react-query";

import apiClient from "../../../../config";
import { IAPIError, ICreateOrganizationValue, IOrganization } from "../../../../types";
import { API_MUTATION_KEY, APIS_ROUTES } from "../../../../utils";

const createOrganization = async (value: ICreateOrganizationValue) => {
  const result = await apiClient.post(
    `${APIS_ROUTES.ORGANIZATION_SERVICE}/create-organization`,
    value
  );

  return result.data.Data.item as IOrganization;
};

export const useCreateOrganization = () =>
  useMutation<IOrganization, IAPIError, ICreateOrganizationValue>(
    [API_MUTATION_KEY.CREATE_ORGANIZATION],
    createOrganization
  );

export default useCreateOrganization;
