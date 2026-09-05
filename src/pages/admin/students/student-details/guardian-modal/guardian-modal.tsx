import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import { IAddGuardianValue } from "../../../../../types";
import ButtonSpinner from "../../../../../icons/button-spinner";

interface GuardianModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (value: IAddGuardianValue) => void;
}

const inputClass =
  "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm";

const GuardianModal = ({ isOpen, isSubmitting, onClose, onSubmit }: GuardianModalProps) => {
  const [parentEmail, setParentEmail] = useState("");
  const [parentName, setParentName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [relationshipType, setRelationshipType] = useState("GUARDIAN");
  const [isPrimaryGuardian, setIsPrimaryGuardian] = useState(false);
  const [isEmergencyContact, setIsEmergencyContact] = useState(false);
  const [canPickup, setCanPickup] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ parentEmail, parentName, phoneNumber, relationshipType, isPrimaryGuardian, isEmergencyContact, canPickup });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>

        <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6 sm:align-middle">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button type="button" className="text-gray-400 hover:text-gray-500" onClick={onClose}>
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <h3 className="text-lg font-medium text-gray-900 mb-4">Add Guardian</h3>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" className={inputClass} value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input className={inputClass} value={parentName} onChange={(e) => setParentName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input className={inputClass} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Relationship</label>
              <select className={inputClass} value={relationshipType} onChange={(e) => setRelationshipType(e.target.value)}>
                <option value="FATHER">Father</option>
                <option value="MOTHER">Mother</option>
                <option value="GUARDIAN">Guardian</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={isPrimaryGuardian} onChange={(e) => setIsPrimaryGuardian(e.target.checked)} />
                Primary guardian
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={isEmergencyContact} onChange={(e) => setIsEmergencyContact(e.target.checked)} />
                Emergency contact
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" checked={canPickup} onChange={(e) => setCanPickup(e.target.checked)} />
                Can pick up
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
                {isSubmitting && <ButtonSpinner />}
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GuardianModal;
