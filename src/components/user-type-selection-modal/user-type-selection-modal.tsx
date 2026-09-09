import { UserGroupIcon, UserIcon } from "@heroicons/react/24/outline";

import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";

interface UserTypeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStudent: () => void;
  onSelectTeacher: () => void;
}

const UserTypeSelectionModal = ({ isOpen, onClose, onSelectStudent, onSelectTeacher }: UserTypeSelectionModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(next) => !next && onClose()}>
      <DialogContent showDefaultClose className="sm:max-w-lg">
        <div className="p-4 sm:p-6">
          <div className="mt-3 text-center sm:mt-0 sm:text-left">
            <DialogTitle className="text-lg leading-6 font-medium mb-4">Select User Type</DialogTitle>
            <p className="text-sm text-gray-500 mb-6">Please select the type of user you want to add to the system.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Option */}
              <button
                onClick={onSelectStudent}
                className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
              >
                <div className="p-4 bg-indigo-100 rounded-full mb-4 group-hover:bg-indigo-200 transition-colors">
                  <UserGroupIcon className="h-8 w-8 text-indigo-600" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Student</h4>
                <p className="text-sm text-gray-500 text-center">Add a new student to the system</p>
              </button>

              {/* Teacher Option */}
              <button
                onClick={onSelectTeacher}
                className="flex flex-col items-center justify-center p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
              >
                <div className="p-4 bg-indigo-100 rounded-full mb-4 group-hover:bg-indigo-200 transition-colors">
                  <UserIcon className="h-8 w-8 text-indigo-600" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">Teacher</h4>
                <p className="text-sm text-gray-500 text-center">Add a new teacher to the system</p>
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserTypeSelectionModal;
