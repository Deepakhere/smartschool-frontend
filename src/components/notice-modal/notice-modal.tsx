import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { SparklesIcon } from "@heroicons/react/24/solid";

import DatePicker from "../date-picker";
import SelectDropdown from "../custom-select";
import ButtonSpinner from "../../icons/button-spinner";
import useNoticeModalController from "./notice-modal-controller";
import { ICreateNoticeRequest } from "../../types";

interface NoticeModalProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (formData: ICreateNoticeRequest) => void;
}

const NoticeModal = ({
  isOpen,
  isLoading,
  onClose,
  onSubmit,
}: NoticeModalProps) => {
  const {
    t,
    formData,
    file,
    fileInputRef,
    isGeneratingContent,
    noticeTypeOptions,
    selectedNoticeType,
    handleSubmit,
    handleChange,
    handleDateChange,
    handleNoticeTypeChange,
    handleFileChange,
    generateContentWithAI,
  } = useNoticeModalController(onSubmit);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={onClose}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={onClose}
                >
                  <span className="sr-only">{t("labels.close")}</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900"
                  >
                    {t("labels.add_new_notice")}
                  </Dialog.Title>
                  <div className="mt-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label
                          htmlFor="title"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          {t("labels.title")}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            id="title"
                            name="title"
                            placeholder={t("messages.enter_title")}
                            value={formData.title}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                            required
                          />
                          <button
                            type="button"
                            onClick={generateContentWithAI}
                            disabled={
                              !formData.title.trim() || isGeneratingContent
                            }
                            className="mt-1 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Generate content with AI"
                          >
                            {isGeneratingContent ? (
                              <ButtonSpinner />
                            ) : (
                              <SparklesIcon className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="content"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          {t("labels.content")}
                        </label>
                        <textarea
                          id="content"
                          name="content"
                          placeholder={t("messages.enter_content")}
                          value={formData.content}
                          onChange={handleChange}
                          rows={4}
                          className="mt-1 block w-full p-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                          required
                        />
                      </div>

                      <div>
                        <DatePicker
                          label={t("labels.date")}
                          value={formData.date}
                          onChange={handleDateChange}
                          placeholder={t("messages.select_date")}
                        />
                      </div>

                      <div>
                        <SelectDropdown
                          label={t("labels.type")}
                          options={noticeTypeOptions}
                          value={selectedNoticeType}
                          onChange={handleNoticeTypeChange}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="attachment"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          {t("labels.attachment")}
                        </label>
                        <input
                          type="file"
                          id="attachment"
                          name="attachment"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {file && (
                          <p className="mt-2 text-sm text-gray-500">
                            {t("labels.selected_file")}: {file.name}
                          </p>
                        )}
                      </div>

                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                        >
                          {isLoading ? (
                            <ButtonSpinner />
                          ) : (
                            t("buttons.add_notice")
                          )}
                        </button>
                        <button
                          type="button"
                          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                          onClick={onClose}
                        >
                          {t("buttons.cancel")}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default NoticeModal;
