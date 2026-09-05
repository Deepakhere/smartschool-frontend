import LogoSpinner from "../../../components/logo-spinner";
import NoRecordFound from "../../../components/no-record-found";
import { useTranslation } from "react-i18next";
import { XMarkIcon } from "@heroicons/react/24/outline";
import ButtonSpinner from "../../../icons/button-spinner";
import useTeachersController from "./teachers-controller";

const inputClass =
  "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm";

const AdminTeachers = () => {
  const { t } = useTranslation();
  const c = useTeachersController();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Teachers</h1>
        <p className="mt-1 text-sm text-gray-500">Teacher directory and staff profiles</p>
      </div>

      <div className="px-4 sm:px-6 md:px-8">
        <div className="bg-white shadow rounded-lg">
          {c.isLoading ? (
            <LogoSpinner offsetSidebar />
          ) : c.teachers.length === 0 ? (
            <NoRecordFound t={t} searchTerm="" clearFilters={() => {}} />
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Designation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {c.teachers.map((teacher) => (
                  <tr key={teacher.userId}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{teacher.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{teacher.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{teacher.staffProfile?.employeeCode || "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{teacher.staffProfile?.designation || "-"}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{teacher.staffProfile?.department || "-"}</td>
                    <td className="px-6 py-4 text-right text-sm">
                      <button onClick={() => c.openEdit(teacher)} className="text-indigo-600 hover:text-indigo-800">
                        Edit profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {c.editingTeacher && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 opacity-75" onClick={c.closeEdit}></div>

            <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6 sm:align-middle">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button type="button" className="text-gray-400 hover:text-gray-500" onClick={c.closeEdit}>
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Edit Staff Profile — {c.editingTeacher.name}
              </h3>

              <form onSubmit={c.submitProfile} className="space-y-4 text-left">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Employee Code</label>
                    <input className={inputClass} value={c.employeeCode} onChange={(e) => c.setEmployeeCode(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Joining</label>
                    <input type="date" className={inputClass} value={c.dateOfJoining} onChange={(e) => c.setDateOfJoining(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Designation</label>
                  <input className={inputClass} value={c.designation} onChange={(e) => c.setDesignation(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Department</label>
                  <input className={inputClass} value={c.department} onChange={(e) => c.setDepartment(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Qualification</label>
                  <input className={inputClass} value={c.qualification} onChange={(e) => c.setQualification(e.target.value)} />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={c.closeEdit} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Cancel
                  </button>
                  <button type="submit" disabled={c.isSaving} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
                    {c.isSaving && <ButtonSpinner />}
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTeachers;
