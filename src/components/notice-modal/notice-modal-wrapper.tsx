// import { ICreateNoticeRequest } from "../../types";
// import useNoticeModalController from "./notice-modal-controller";
// import NoticeModal from "./notice-modal";
// import NoticeTypeSelectionModal from "./notice-type-selection-modal";

// interface NoticeModalWrapperProps {
//   isLoading: boolean;
//   onSubmit: (formData: ICreateNoticeRequest) => void;
// }

// const NoticeModalWrapper = ({
//   isLoading,
//   onSubmit,
// }: NoticeModalWrapperProps) => {
//   const {
//     t,
//     isSelectionModalOpen,
//     isNoticeModalOpen,
//     useAIGeneration,
//     closeSelectionModal,
//     handleSelectAI,
//     handleSelectCustom,
//     closeNoticeModal,
//     file,
//     formData,
//     fileInputRef,
//     noticeTypeOptions,
//     selectedNoticeType,
//     isGeneratingContent,
//     handleChange,
//     handleDateChange,
//     handleNoticeTypeChange,
//     handleFileChange,
//     handleSubmit,
//     generateContentWithAI,
//   } = useNoticeModalController(onSubmit);

//   return (
//     <>
//       <NoticeTypeSelectionModal
//         isOpen={isSelectionModalOpen}
//         onClose={closeSelectionModal}
//         onSelectAI={handleSelectAI}
//         onSelectCustom={handleSelectCustom}
//       />

//       {/* <NoticeModal
//         t={t}
//         isOpen={isNoticeModalOpen}
//         isLoading={isLoading}
//         onClose={closeNoticeModal}
//         onSubmit={handleSubmit}
//         file={file}
//         formData={formData}
//         fileInputRef={fileInputRef}
//         noticeTypeOptions={noticeTypeOptions}
//         selectedNoticeType={selectedNoticeType}
//         isGeneratingContent={isGeneratingContent}
//         useAIGeneration={useAIGeneration}
//         handleChange={handleChange}
//         handleDateChange={handleDateChange}
//         handleNoticeTypeChange={handleNoticeTypeChange}
//         handleFileChange={handleFileChange}
//         generateContentWithAI={generateContentWithAI}
//       /> */}
//     </>
//   );
// };

// export default NoticeModalWrapper;
