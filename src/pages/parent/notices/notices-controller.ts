import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useGetMyNotices, useMarkNoticeRead } from "./service/notices-service";

const useNoticesController = () => {
  const { t } = useTranslation();
  const { organizationId } = useParams();

  const getMyNotices = useGetMyNotices(organizationId || "");
  const markNoticeRead = useMarkNoticeRead(organizationId || "");

  const notices = getMyNotices.data?.items || [];

  const handleMarkRead = (noticeId: string) => {
    markNoticeRead.mutate(noticeId);
  };

  return {
    t,
    notices,
    isLoading: getMyNotices.isLoading,
    handleMarkRead,
  };
};

export default useNoticesController;
