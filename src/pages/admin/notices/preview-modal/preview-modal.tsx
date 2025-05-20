import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Spinner from "../../../../components/spinner";

interface AttachmentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  attachmentURL: string;
  fileName?: string;
}

const AttachmentPreviewModal = ({
  isOpen,
  onClose,
  attachmentURL,
  fileName = "Document Preview",
}: AttachmentPreviewModalProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [viewerFailed, setViewerFailed] = useState(false);

  // Use Google Docs Viewer for reliable PDF preview
  const googleDocsViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(
    attachmentURL
  )}&embedded=true`;

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setViewerFailed(true);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {fileName}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="relative h-[70vh] bg-white rounded-md overflow-hidden">
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Spinner />
                    </div>
                  )}

                  <iframe
                    src={googleDocsViewerUrl}
                    className="w-full h-full border-0"
                    onLoad={handleIframeLoad}
                    onError={handleIframeError}
                    title="PDF Preview"
                  />

                  {viewerFailed && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
                      <div className="text-center p-6">
                        <p className="text-gray-700 mb-4">
                          Unable to preview this PDF document.
                        </p>
                        <a
                          href={attachmentURL}
                          download
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          Download Instead
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex justify-end">
                  <a
                    href={attachmentURL}
                    download
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Download
                  </a>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AttachmentPreviewModal;
