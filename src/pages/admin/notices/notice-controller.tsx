import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { useCreateNotice, useGetNoticeList } from "./service";
import { ICreateNoticeRequest, INotice } from "../../../types";
import { useError } from "../../../hooks";

const useNoticeController = () => {
  const { t } = useTranslation();
  const { organizationId } = useParams();

  const [notices, setNotices] = useState<INotice[]>([]);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);

  const getNoticeList = useGetNoticeList(organizationId, "", "", 10, 1);
  const createNotice = useCreateNotice(organizationId || "");

  useError({
    mutation: createNotice,
  });

  const handleViewAttachment = (attachmentUrl: string) => {
    window.open(attachmentUrl, "_blank");
  };

  const handleDownloadAttachment = (
    attachmentUrl: string,
    fileName: string
  ) => {
    const link = document.createElement("a");
    link.href = attachmentUrl;
    link.download = fileName || "notice-attachment";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateNotice = (formData: ICreateNoticeRequest) => {
    const noticeFormData = new FormData();

    noticeFormData.append("title", formData.title);
    noticeFormData.append("content", formData.content);
    noticeFormData.append("type", formData.type);

    if (formData.date) {
      noticeFormData.append("date", formData.date);
    }

    if (formData.attachment instanceof File) {
      noticeFormData.append("attachment", formData.attachment);
    }

    createNotice.mutate(noticeFormData);
  };

  const onClickCreateNotice = () => {
    setIsNoticeModalOpen(true);
  };

  const onCancel = () => {
    setIsNoticeModalOpen(false);
  };

  useEffect(() => {
    if (getNoticeList.isSuccess && getNoticeList.data) {
      setNotices(getNoticeList.data.items);
    }
  }, [getNoticeList.isSuccess, getNoticeList.data]);

  useEffect(() => {
    if (createNotice.isSuccess) {
      toast.success(t("messages.notice_created_successfully"));
      getNoticeList.refetch();
      setIsNoticeModalOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createNotice.isSuccess]);

  return {
    t,
    notices,
    isNoticeModalOpen,
    isLoadingNoticeList: getNoticeList.isLoading,
    isFetchingNoticeList: getNoticeList.isFetching,
    isCreatingNotice: createNotice.isLoading,
    isSuccessNoticeCreation: createNotice.isSuccess,
    onCancel,
    handleCreateNotice,
    handleViewAttachment,
    handleDownloadAttachment,
    onClickCreateNotice,
  };
};

export default useNoticeController;
