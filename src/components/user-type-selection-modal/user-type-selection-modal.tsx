import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

interface UserTypeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStudent: () => void;
  onSelectTeacher: () => void;
}

const UserTypeSelectionModal = ({
  isOpen,
  onClose,
  onSelectStudent,
  onSelectTeacher,
}: UserTypeSelectionModalProps) => {
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
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div>
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900 mb-4"
                  >
                    Select User Type
                  </Dialog.Title>
                  <p className="text-sm text-gray-500 mb-6">
                    Please select the type of user you want to add to the
                    system.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Student Option */}
                    <button
                      onClick={onSelectStudent}
                      className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                    >
                      <div className="p-4 bg-indigo-100 rounded-full mb-4 group-hover:bg-indigo-200 transition-colors">
                        <UserGroupIcon className="h-8 w-8 text-indigo-600" />
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        Student
                      </h4>
                      <p className="text-sm text-gray-500 text-center">
                        Add a new student to the system
                      </p>
                    </button>

                    {/* Teacher Option */}
                    <button
                      onClick={onSelectTeacher}
                      className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                    >
                      <div className="p-4 bg-indigo-100 rounded-full mb-4 group-hover:bg-indigo-200 transition-colors">
                        <UserIcon className="h-8 w-8 text-indigo-600" />
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">
                        Teacher
                      </h4>
                      <p className="text-sm text-gray-500 text-center">
                        Add a new teacher to the system
                      </p>
                    </button>
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

export default UserTypeSelectionModal;
