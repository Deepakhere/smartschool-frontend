import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import ButtonSpinner from "../../icons/button-spinner";
import { ICreateAccountValue } from "../../types";

const inputClass =
  "mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm";

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: ICreateAccountValue) => void;
  isSubmitting: boolean;
}

const CreateAccountModal = ({ isOpen, onClose, onSubmit, isSubmitting }: CreateAccountModalProps) => {
  const [value, setValue] = useState<ICreateAccountValue>({
    accountName: "",
    ownerEmail: "",
    ownerName: "",
    schoolName: "",
    address: "",
    pincode: "",
  });

  if (!isOpen) return null;

  const set = (field: keyof ICreateAccountValue) => (e: React.ChangeEvent<HTMLInputElement>) =>
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

        <div className="relative w-full max-h-[90vh] overflow-y-auto transform rounded-lg bg-white text-left shadow-xl transition-all sm:max-w-lg">
          <div className="absolute top-4 right-4">
            <button type="button" className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none" onClick={onClose}>
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <div className="p-4 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-1">New Customer</h3>
            <p className="text-sm text-gray-500 mb-4">
              Creates the customer account and their first school. The owner will be invited by email if they don't
              already have a login.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer / Account Name</label>
                <input className={inputClass} value={value.accountName} onChange={set("accountName")} required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Owner Name</label>
                  <input className={inputClass} value={value.ownerName} onChange={set("ownerName")} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Owner Email</label>
                  <input type="email" className={inputClass} value={value.ownerEmail} onChange={set("ownerEmail")} required />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <label className="block text-sm font-medium text-gray-700">First School Name</label>
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
                  Create Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccountModal;
