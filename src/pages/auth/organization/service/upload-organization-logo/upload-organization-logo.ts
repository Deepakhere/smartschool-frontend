import { useMutation } from "react-query";

import apiClient from "../../../../../config";
import { IAPIError, IAxiosResponse, IOrganization } from "../../../../../types";
import { API_MUTATION_KEY, APIS_ROUTES } from "../../../../../utils";

const uploadOrganizationLogo = async ({
  organizationId,
  file,
}: {
  organizationId: string;
  file: File;
}): Promise<IOrganization> => {
  const formData = new FormData();
  formData.append("logo", file);

  const result = await apiClient.post<
    null,
    IAxiosResponse<{ item: IOrganization }>
  >(`${APIS_ROUTES.ORGANIZATION_SERVICE}/${organizationId}/logo`, formData);

  return result.data.Data.item;
};

export const useUploadOrganizationLogo = () =>
  useMutation<IOrganization, IAPIError, { organizationId: string; file: File }>(
    [API_MUTATION_KEY.UPLOAD_ORGANIZATION_LOGO],
    uploadOrganizationLogo
  );

export default useUploadOrganizationLogo;
