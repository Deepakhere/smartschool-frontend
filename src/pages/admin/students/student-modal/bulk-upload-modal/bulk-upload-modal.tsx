import { XMarkIcon } from "@heroicons/react/24/outline";

import ButtonSpinner from "../../../../../icons/button-spinner";
import useBulkUploadModalController from "./bulk-upload-modal-controller";

interface BulkUploadModalProps {
  isOpen: boolean;
  organizationId: string;
  onClose: () => void;
  onImported: () => void;
}

const inputClass =
  "mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm";

const BulkUploadModal = ({ isOpen, organizationId, onClose, onImported }: BulkUploadModalProps) => {
  const c = useBulkUploadModalController(organizationId, onImported);

  if (!isOpen) return null;

  const handleClose = () => {
    c.reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 opacity-75" onClick={handleClose}></div>

        <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:max-w-xl sm:w-full sm:p-6 sm:align-middle">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button type="button" className="text-gray-400 hover:text-gray-500" onClick={handleClose}>
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <h3 className="text-lg font-medium text-gray-900 mb-1">Bulk Upload Students (CSV)</h3>
          <p className="text-sm text-gray-500 mb-4">
            Choose the class and section these students belong to, then upload a CSV with columns:{" "}
            <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
              name, dateOfBirth, rollNumber, parentEmail, parentName, phoneNumber, address, city, state, pincode
            </code>
          </p>

          {!c.result ? (
            <form onSubmit={c.handleSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Academic Year</label>
                  <select className={inputClass} value={c.academicYearId} onChange={(e) => c.setAcademicYearId(e.target.value)}>
                    <option value="">Select</option>
                    {c.academicYears.map((y) => (
                      <option key={y.id} value={y.id}>{y.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Class</label>
                  <select
                    className={inputClass}
                    value={c.classId}
                    onChange={(e) => c.setClassId(e.target.value)}
                    disabled={!c.academicYearId}
                  >
                    <option value="">Select</option>
                    {c.classes.map((k) => (
                      <option key={k.id} value={k.id}>{k.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Section</label>
                  <select
                    className={inputClass}
                    value={c.sectionId}
                    onChange={(e) => c.setSectionId(e.target.value)}
                    disabled={!c.classId}
                  >
                    <option value="">Select</option>
                    {c.sections.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">CSV File</label>
                <input type="file" accept=".csv,text/csv" onChange={c.handleFileChange} className={inputClass} />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={c.isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                  {c.isSubmitting && <ButtonSpinner />}
                  Upload
                </button>
              </div>
            </form>
          ) : (
            <div className="text-left">
              <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-3">
                <p className="text-sm text-green-800">{c.result.createdCount} student(s) added successfully.</p>
              </div>

              {c.result.failed.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3 max-h-48 overflow-y-auto">
                  <p className="text-sm font-medium text-red-800 mb-2">{c.result.failed.length} row(s) failed:</p>
                  <ul className="text-sm text-red-700 space-y-1">
                    {c.result.failed.map((f, i) => (
                      <li key={i}>
                        Row {f.row} ({f.name || "unnamed"}): {f.reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={c.reset}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Upload Another
                </button>
                <button
                  onClick={handleClose}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkUploadModal;
