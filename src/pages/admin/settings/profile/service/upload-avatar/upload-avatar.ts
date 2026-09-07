import { useMutation } from "react-query";

import apiClient from "../../../../../../config";
import { IAPIError, IAxiosResponse, IUserAvatar } from "../../../../../../types";
import { API_MUTATION_KEY, APIS_ROUTES } from "../../../../../../utils";

const uploadAvatar = async (file: File): Promise<IUserAvatar> => {
  const formData = new FormData();
  formData.append("avatar", file);

  const result = await apiClient.post<
    null,
    IAxiosResponse<{ item: IUserAvatar }>
  >(APIS_ROUTES.UPLOAD_AVATAR, formData);

  return result.data.Data.item;
};

export const useUploadAvatar = () =>
  useMutation<IUserAvatar, IAPIError, File>(
    [API_MUTATION_KEY.UPLOAD_AVATAR],
    uploadAvatar
  );

export default useUploadAvatar;
