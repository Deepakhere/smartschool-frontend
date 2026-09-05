import NoticeModal from "./notice-modal";

import NoticeTypeSelectionModal from "./notice-type-selection-modal";
import useNoticeModalWrapperController from "./notice-modal-wrapper-controller";
import { ICreateNoticeRequest } from "../../types";

interface NoticeModalWrapperProps {
  isOpen: boolean;
  onCancel: () => void;
  isLoading: boolean;
  onSubmit: (formData: ICreateNoticeRequest) => void;
  isSuccessNoticeCreation: boolean;
}

const NoticeModalWrapper = ({
  isOpen,
  onCancel,
  isLoading,
  onSubmit,
  isSuccessNoticeCreation,
}: NoticeModalWrapperProps) => {
  const {
    t,
    file,
    formData,
    fileInputRef,
    isAIModalOpen,
    isNoticeModalOpen,
    noticeTypeOptions,
    selectedNoticeType,
    isGeneratingContent,
    isAIPreviewModalOpen,
    classOptions,
    sectionOptions,
    roleOptions,
    sectionPickerClassId,
    setSectionPickerClassId,
    handleAudienceScopeChange,
    handleAudienceRoleToggle,
    handleAudienceClassToggle,
    handleAudienceSectionToggle,
    handleSelectAI,
    handleSelectCustom,
    closeNoticeModal,
    handleChange,
    handleDateChange,
    handleNoticeTypeChange,
    handleFileChange,
    handleSubmit,
    generateContentWithAI,
    onClickAIPreviewButton,
    onCloseAIPreviewModal,
  } = useNoticeModalWrapperController(
    isSuccessNoticeCreation,
    onCancel,
    onSubmit
  );

  return (
    <>
      <NoticeTypeSelectionModal
        isOpen={isOpen}
        onClose={onCancel}
        onSelectAI={handleSelectAI}
        onSelectCustom={handleSelectCustom}
      />

      <NoticeModal
        t={t}
        file={file}
        formData={formData}
        isLoading={isLoading}
        fileInputRef={fileInputRef}
        isOpen={isNoticeModalOpen}
        noticeTypeOptions={noticeTypeOptions}
        selectedNoticeType={selectedNoticeType}
        isGeneratingContent={isGeneratingContent}
        isAIModalOpen={isAIModalOpen}
        isAIPreviewModalOpen={isAIPreviewModalOpen}
        classOptions={classOptions}
        sectionOptions={sectionOptions}
        roleOptions={roleOptions}
        sectionPickerClassId={sectionPickerClassId}
        setSectionPickerClassId={setSectionPickerClassId}
        handleAudienceScopeChange={handleAudienceScopeChange}
        handleAudienceRoleToggle={handleAudienceRoleToggle}
        handleAudienceClassToggle={handleAudienceClassToggle}
        handleAudienceSectionToggle={handleAudienceSectionToggle}
        onClickAIPreviewButton={onClickAIPreviewButton}
        onCloseAIPreviewModal={onCloseAIPreviewModal}
        onClose={closeNoticeModal}
        onSubmit={handleSubmit}
        handleChange={handleChange}
        handleDateChange={handleDateChange}
        handleNoticeTypeChange={handleNoticeTypeChange}
        handleFileChange={handleFileChange}
        generateContentWithAI={generateContentWithAI}
      />
    </>
  );
};

export default NoticeModalWrapper;
