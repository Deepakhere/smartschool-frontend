import { useMutation } from "@tanstack/react-query";

import apiClient from "@/config";
import { IAPIError, IOrganization } from "@/types";
import { API_MUTATION_KEY, APIS_ROUTES } from "@/utils";

export interface IUpdateOrganizationValue {
  name: string;
  address: string;
  pincode: string;
  description?: string;
}

const updateOrganization = async ({
  organizationId,
  value,
}: {
  organizationId: string;
  value: IUpdateOrganizationValue;
}): Promise<IOrganization> => {
  const result = await apiClient.put(
    `${APIS_ROUTES.ORGANIZATION_SERVICE}/update-organization/${organizationId}`,
    value
  );

  return result.data.Data.item as IOrganization;
};

export const useUpdateOrganization = () =>
  useMutation<IOrganization, IAPIError, { organizationId: string; value: IUpdateOrganizationValue }>({
    mutationKey: [API_MUTATION_KEY.UPDATE_ORGANIZATION],
    mutationFn: updateOrganization,
  });

export default useUpdateOrganization;
