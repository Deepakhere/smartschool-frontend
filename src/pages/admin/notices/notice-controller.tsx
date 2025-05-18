import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

import { useGetNoticeList } from "./service";
import { ICreateNoticeRequest, INotice } from "../../../types";

const useNoticeController = () => {
  const { t } = useTranslation();
  const { organizationId } = useParams();

  const [notices, setNotices] = useState<INotice[]>([]);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);

  const getNoticeList = useGetNoticeList(organizationId, "", "", 10, 1);

  const handleSubmit = async (formData: ICreateNoticeRequest) => {
    // createNotice.mutate(formData);
    console.log(formData);
  };

  useEffect(() => {
    if (getNoticeList.isSuccess && getNoticeList.data) {
      setNotices(getNoticeList.data.items);
    }
  }, [getNoticeList.isSuccess, getNoticeList.data]);

  // useEffect(() => {
  //   if (createNotice.isSuccess) {
  //     toast.success(t("messages.notice_created_successfully"));
  //     getNoticeList.refetch();
  //     setIsNoticeModalOpen(false);
  //   }
  // }, [createNotice.isSuccess]);

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

  const onClickCreateNotice = () => {
    setIsNoticeModalOpen(true);
  };

  const onCancel = () => {
    setIsNoticeModalOpen(false);
  };

  return {
    t,
    notices,
    isNoticeModalOpen,
    isLoadingNoticeList: getNoticeList.isLoading,
    isFetchingNoticeList: getNoticeList.isFetching,
    onCancel,
    handleSubmit,
    handleViewAttachment,
    handleDownloadAttachment,
    onClickCreateNotice,
  };
};

export default useNoticeController;
