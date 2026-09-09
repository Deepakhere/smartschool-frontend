import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Spinner from "@/components/spinner";

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
  const googleDocsViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(attachmentURL)}&embedded=true`;

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setViewerFailed(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(next) => !next && onClose()}>
      <DialogContent className="sm:max-w-4xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <DialogTitle className="text-lg font-medium">{fileName}</DialogTitle>
            <button type="button" className="rounded-md bg-white text-gray-400 hover:text-gray-500" onClick={onClose}>
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
                  <p className="text-gray-700 mb-4">Unable to preview this PDF document.</p>
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AttachmentPreviewModal;
