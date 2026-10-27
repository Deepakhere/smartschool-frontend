import { PlusIcon } from "@heroicons/react/20/solid";

import DataTable from "@/components/data-table";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import NoticeModal from "@/components/notice-modal";
import NoticePreviewModal from "@/components/notice-preview-modal/notice-preview-modal";
import SectionHeader from "@/components/section-header";
import { noticeColumns } from "./notice-columns";
import useNoticeController from "./notice-controller";
import AttachmentPreviewModal from "./preview-modal";

const AdminNotices = () => {
  const {
    t,
    notices,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalNotices,
    isNoticeModalOpen,
    isLoadingNoticeList,
    isFetchingNoticeList,
    isCreatingNotice,
    isSuccessNoticeCreation,
    previewModalOpen,
    previewAttachmentURL,
    previewFileName,
    onCancel,
    handleCreateNotice,
    handleViewAttachment,
    handleDownloadAttachment,
    onClickCreateNotice,
    noticeIdPendingDelete,
    cancelDeleteNotice,
    confirmDeleteNotice,
    isDeletingNotice,
    setPreviewModalOpen,
    previewNotice,
    onClickPreviewNotice,
    closePreviewNotice,
    onClickDeleteFromDropdown,
  } = useNoticeController();

  const columns = noticeColumns({
    viewAttachment: handleViewAttachment,
    downloadAttachment: handleDownloadAttachment,
    preview: onClickPreviewNotice,
    remove: onClickDeleteFromDropdown,
  });

  return (
    <>
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="All Notices"
          description="View and manage all school notices"
          action={{ label: t("labels.create_notice"), icon: PlusIcon, onClick: onClickCreateNotice }}
        />

        <DataTable
          columns={columns}
          data={notices}
          getRowId={(notice) => notice.id}
          isLoading={isLoadingNoticeList || isFetchingNoticeList}
          pagination={{ page, pageSize, total: totalNotices, onPageChange: setPage, onPageSizeChange: setPageSize }}
          itemLabel={{ one: "notice", other: "notices" }}
          empty={{ title: "No notices yet", description: "Use Create Notice to publish the first one." }}
        />
      </div>

      <NoticeModal
        isOpen={isNoticeModalOpen}
        onCancel={onCancel}
        isLoading={isCreatingNotice}
        onSubmit={handleCreateNotice}
        isSuccessNoticeCreation={isSuccessNoticeCreation}
      />

      {previewNotice && (
        <NoticePreviewModal isOpen={!!previewNotice} onClose={closePreviewNotice} notice={previewNotice} />
      )}

      <AttachmentPreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        attachmentURL={previewAttachmentURL}
        fileName={previewFileName}
      />

      <DeleteConfirmationDialog
        open={!!noticeIdPendingDelete}
        title="Delete Notice"
        description="Are you sure you want to delete this notice? This action cannot be undone."
        isLoading={isDeletingNotice}
        onClose={cancelDeleteNotice}
        onConfirm={confirmDeleteNotice}
      />
    </>
  );
};

export default AdminNotices;
