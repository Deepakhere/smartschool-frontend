import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import ButtonSpinner from "../../icons/button-spinner";
import { IAddOrganizationToAccountValue } from "../../types";

const inputClass =
  "mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm";

interface AddSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: IAddOrganizationToAccountValue) => void;
  isSubmitting: boolean;
}

const AddSchoolModal = ({ isOpen, onClose, onSubmit, isSubmitting }: AddSchoolModalProps) => {
  const [value, setValue] = useState<IAddOrganizationToAccountValue>({ schoolName: "", address: "", pincode: "" });

  if (!isOpen) return null;

  const set = (field: keyof IAddOrganizationToAccountValue) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValue((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(value);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="relative w-full max-h-[90vh] overflow-y-auto transform rounded-lg bg-white text-left shadow-xl transition-all sm:max-w-md">
          <div className="absolute top-4 right-4">
            <button type="button" className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none" onClick={onClose}>
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="p-4 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-1">Add School</h3>
            <p className="text-sm text-gray-500 mb-4">
              The existing owner automatically gets admin access — no new invite needed.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium text-gray-700">School Name</label>
                <input className={inputClass} value={value.schoolName} onChange={set("schoolName")} required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input className={inputClass} value={value.address} onChange={set("address")} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pincode</label>
                  <input className={inputClass} value={value.pincode} onChange={set("pincode")} required />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isSubmitting && <ButtonSpinner />}
                  Add School
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSchoolModal;
