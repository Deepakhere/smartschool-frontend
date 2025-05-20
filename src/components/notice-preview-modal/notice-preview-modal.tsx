import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, PrinterIcon } from "@heroicons/react/24/outline";

import { ICreateNoticeRequest } from "../../types";
import organisationLogo from "../../icons/kidsight.png";

interface NoticePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  notice: ICreateNoticeRequest;
  onDownload?: (url: string, fileName: string) => void;
  organizationName?: string;
  organizationLogo?: string;
}

const NoticePreviewModal = ({
  isOpen,
  onClose,
  notice,
  // onDownload,
  organizationName = "School Organization",
  organizationLogo = "/logo.png",
}: NoticePreviewModalProps) => {
  if (!notice) return null;

  const handlePrint = () => {
    const printContent = document.getElementById("notice-print-content");
    if (printContent) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>${notice.title} - Notice</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 40px; }
                .header { display: flex; align-items: center; margin-bottom: 30px; }
                .logo { width: 80px; height: auto; margin-right: 20px; }
                .org-name { font-size: 24px; font-weight: bold; }
                .notice-title { font-size: 20px; font-weight: bold; margin-bottom: 10px; }
                .notice-meta { color: #666; margin-bottom: 20px; }
                .notice-content { line-height: 1.6; white-space: pre-line; }
                .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #666; }
              </style>
            </head>
            <body>
              <div class="header">
                <img src="${organisationLogo}" class="logo" />
                <div class="org-name">${organizationName}</div>
              </div>
              <div class="notice-title">${notice.title}</div>
              <div class="notice-meta">
                <div>Date: ${new Date(
                  notice.date ? notice.date : Date.now()
                ).toLocaleDateString()}</div>
                <div>Type: ${
                  notice.type.charAt(0).toUpperCase() + notice.type.slice(1)
                }</div>
              </div>
              <div class="notice-content">${notice.content}</div>
              <div class="footer">
                This is an official notice from ${organizationName}
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
    }
  };

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
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4 flex space-x-2">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={handlePrint}
                >
                  <span className="sr-only">Print</span>
                  <PrinterIcon className="h-6 w-6" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={onClose}
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <div
                id="notice-print-content"
                className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm"
              >
                {/* Header with Organization Logo and Name */}
                <div className="flex items-center mb-8 pb-4 border-b border-gray-200">
                  <img
                    src={organizationLogo}
                    alt="Organization Logo"
                    className="h-12 w-auto mr-4"
                  />
                  <h2 className="text-xl font-bold text-gray-800">
                    {organizationName}
                  </h2>
                </div>

                {/* Notice Title and Type */}
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {notice.title}
                  </h1>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Date:
                      {new Date(
                        notice.date ? notice?.date : Date.now()
                      ).toLocaleDateString()}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${
                        notice.type === "holiday"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {notice.type.charAt(0).toUpperCase() +
                        notice.type.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Notice Content */}
                <div className="prose max-w-none mb-8">
                  <div className="text-gray-700 whitespace-pre-line">
                    {notice.content}
                  </div>
                </div>

                {/* Attachment Section */}
                {/* {notice.attachmentURL && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        Attachment
                      </h4>
                      <button
                        onClick={() =>
                          onDownload(
                            notice.attachmentURL,
                            `notice-${notice.id}`
                          )
                        }
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                        Download
                      </button>
                    </div>

                    <div className="mt-2">
                      {notice.attachmentURL.endsWith(".pdf") ? (
                        <iframe
                          src={`${notice.attachmentURL}#toolbar=0`}
                          className="w-full h-96 border rounded"
                          title="PDF Preview"
                        />
                      ) : notice.attachmentURL.match(
                          /\.(jpeg|jpg|gif|png)$/
                        ) ? (
                        <img
                          src={notice.attachmentURL}
                          alt="Attachment preview"
                          className="max-w-full h-auto rounded"
                        />
                      ) : (
                        <div className="p-4 bg-gray-100 rounded text-center">
                          Preview not available for this file type
                        </div>
                      )}
                    </div>
                  </div>
                )} */}

                {/* Footer */}
                <div className="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
                  This is an official notice from {organizationName}
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default NoticePreviewModal;
