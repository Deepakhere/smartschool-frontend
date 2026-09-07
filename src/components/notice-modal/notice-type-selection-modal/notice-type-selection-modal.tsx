import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { SparklesIcon, PencilSquareIcon } from "@heroicons/react/24/solid";

interface NoticeTypeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAI: () => void;
  onSelectCustom: () => void;
}

const NoticeTypeSelectionModal = ({
  isOpen,
  onClose,
  onSelectAI,
  onSelectCustom,
}: NoticeTypeSelectionModalProps) => {
  if (!isOpen) return;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={onClose}
      >
        <div className="flex min-h-screen items-center justify-center p-4 text-center">
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

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="relative w-full max-h-[90vh] overflow-y-auto transform rounded-lg bg-white text-left shadow-xl transition-all sm:max-w-lg">
              <div className="absolute top-4 right-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={onClose}
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="p-4 sm:p-6">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900"
                  >
                    Create Notice
                  </Dialog.Title>
                  <div className="mt-0">
                    <p className="text-sm text-gray-500 mb-6">
                      Choose how you would like to create your notice:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* AI-Generated Option */}
                      <button
                        onClick={onSelectAI}
                        className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                      >
                        <div className="p-4 bg-indigo-100 rounded-full mb-4 group-hover:bg-indigo-200 transition-colors">
                          <SparklesIcon className="h-8 w-8 text-indigo-600" />
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                          AI-Generated
                        </h4>
                        <p className="text-sm text-gray-500 text-center">
                          Let AI help you create content based on your title
                        </p>
                      </button>

                      {/* Custom Option */}
                      <button
                        onClick={onSelectCustom}
                        className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                      >
                        <div className="p-4 bg-indigo-100 rounded-full mb-4 group-hover:bg-indigo-200 transition-colors">
                          <PencilSquareIcon className="h-8 w-8 text-indigo-600" />
                        </div>
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                          Custom Notice
                        </h4>
                        <p className="text-sm text-gray-500 text-center">
                          Create your notice content manually
                        </p>
                      </button>
                    </div>
                  </div>
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

export default NoticeTypeSelectionModal;
