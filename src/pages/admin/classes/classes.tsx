import Spinner from "../../../components/spinner";
import NoRecordFound from "../../../components/no-record-found";
import SectionHeader from "../../../components/section-header";
import { useTranslation } from "react-i18next";
import useClassesController from "./classes-controller";

const tabs = [
  { key: "years", label: "Academic Years" },
  { key: "classes", label: "Classes" },
  { key: "sections", label: "Sections" },
  { key: "subjects", label: "Subjects" },
  { key: "teachers", label: "Teacher Assignments" },
] as const;

const inputClass =
  "mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm";
const btnPrimary =
  "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50";
const btnSecondary =
  "inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50";

const AdminClasses = () => {
  const { t } = useTranslation();
  const c = useClassesController();

  return (
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        title="Academics"
        description="Manage academic years, classes, sections, subjects and teacher assignments"
      />

      <div className="mb-6">
        <nav className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => c.setActiveTab(tab.key)}
              className={`whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium ${
                c.activeTab === tab.key
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div>
        {c.activeTab === "years" && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-4 flex justify-between items-center border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Academic Years</h2>
              <button className={btnPrimary} onClick={() => c.setShowYearForm(!c.showYearForm)}>
                + Add Academic Year
              </button>
            </div>

            {c.showYearForm && (
              <form onSubmit={c.submitYear} className="p-4 border-b border-gray-200 grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name (e.g. 2026-27)</label>
                  <input className={inputClass} value={c.yearName} onChange={(e) => c.setYearName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <input type="date" className={inputClass} value={c.yearStart} onChange={(e) => c.setYearStart(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <input type="date" className={inputClass} value={c.yearEnd} onChange={(e) => c.setYearEnd(e.target.value)} />
                </div>
                <div className="flex items-end gap-3">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" checked={c.yearIsCurrent} onChange={(e) => c.setYearIsCurrent(e.target.checked)} />
                    Set as current
                  </label>
                </div>
                <div className="sm:col-span-4 flex justify-end gap-3">
                  <button type="button" className={btnSecondary} onClick={() => c.setShowYearForm(false)}>
                    {t("buttons.cancel")}
                  </button>
                  <button type="submit" disabled={c.isCreatingYear} className={btnPrimary}>
                    {t("buttons.save")}
                  </button>
                </div>
              </form>
            )}

            {c.isLoadingYears ? (
              <Spinner />
            ) : c.academicYears.length === 0 ? (
              <NoRecordFound t={t} searchTerm="" clearFilters={() => {}} />
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {c.academicYears.map((y) => (
                    <tr key={y.id}>
                      <td className="px-6 py-4 text-sm text-gray-900">{y.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(y.startDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{new Date(y.endDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm">
                        {y.isCurrent && (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Current</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {c.activeTab === "classes" && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-4 flex justify-between items-center border-b border-gray-200 gap-4">
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-700">Academic Year:</label>
                <select className={inputClass} value={c.selectedAcademicYearId} onChange={(e) => c.setSelectedAcademicYearId(e.target.value)}>
                  {c.academicYears.map((y) => (
                    <option key={y.id} value={y.id}>{y.name}</option>
                  ))}
                </select>
              </div>
              <button className={btnPrimary} onClick={() => c.setShowClassForm(!c.showClassForm)} disabled={!c.selectedAcademicYearId}>
                + Add Class
              </button>
            </div>

            {c.showClassForm && (
              <form onSubmit={c.submitClass} className="p-4 border-b border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name (e.g. Class 10)</label>
                  <input className={inputClass} value={c.className} onChange={(e) => c.setClassName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Numeric Level</label>
                  <input type="number" className={inputClass} value={c.classLevel} onChange={(e) => c.setClassLevel(e.target.value)} />
                </div>
                <div className="flex items-end justify-end gap-3">
                  <button type="button" className={btnSecondary} onClick={() => c.setShowClassForm(false)}>
                    {t("buttons.cancel")}
                  </button>
                  <button type="submit" disabled={c.isCreatingClass} className={btnPrimary}>
                    {t("buttons.save")}
                  </button>
                </div>
              </form>
            )}

            {c.isLoadingClasses ? (
              <Spinner />
            ) : c.classes.length === 0 ? (
              <NoRecordFound t={t} searchTerm="" clearFilters={() => {}} />
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {c.classes.map((k) => (
                    <tr key={k.id}>
                      <td className="px-6 py-4 text-sm text-gray-900">{k.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{k.numericLevel ?? "-"}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{k.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {c.activeTab === "sections" && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-4 flex justify-between items-center border-b border-gray-200 gap-4">
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-700">Class:</label>
                <select className={inputClass} value={c.selectedClassId} onChange={(e) => c.setSelectedClassId(e.target.value)}>
                  {c.classes.map((k) => (
                    <option key={k.id} value={k.id}>{k.name}</option>
                  ))}
                </select>
              </div>
              <button className={btnPrimary} onClick={() => c.setShowSectionForm(!c.showSectionForm)} disabled={!c.selectedClassId}>
                + Add Section
              </button>
            </div>

            {c.showSectionForm && (
              <form onSubmit={c.submitSection} className="p-4 border-b border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name (e.g. A)</label>
                  <input className={inputClass} value={c.sectionName} onChange={(e) => c.setSectionName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Capacity</label>
                  <input type="number" className={inputClass} value={c.sectionCapacity} onChange={(e) => c.setSectionCapacity(e.target.value)} />
                </div>
                <div className="flex items-end justify-end gap-3">
                  <button type="button" className={btnSecondary} onClick={() => c.setShowSectionForm(false)}>
                    {t("buttons.cancel")}
                  </button>
                  <button type="submit" disabled={c.isCreatingSection} className={btnPrimary}>
                    {t("buttons.save")}
                  </button>
                </div>
              </form>
            )}

            {c.isLoadingSections ? (
              <Spinner />
            ) : c.sections.length === 0 ? (
              <NoRecordFound t={t} searchTerm="" clearFilters={() => {}} />
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class Teacher</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {c.sections.map((s) => (
                    <tr key={s.id}>
                      <td className="px-6 py-4 text-sm text-gray-900">{s.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{s.classTeacherId?.name || "Unassigned"}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{s.capacity ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {c.activeTab === "subjects" && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-4 flex justify-between items-center border-b border-gray-200 gap-4">
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-700">Academic Year:</label>
                <select className={inputClass} value={c.selectedAcademicYearId} onChange={(e) => c.setSelectedAcademicYearId(e.target.value)}>
                  {c.academicYears.map((y) => (
                    <option key={y.id} value={y.id}>{y.name}</option>
                  ))}
                </select>
              </div>
              <button className={btnPrimary} onClick={() => c.setShowSubjectForm(!c.showSubjectForm)} disabled={!c.selectedAcademicYearId}>
                + Add Subject
              </button>
            </div>

            {c.showSubjectForm && (
              <form onSubmit={c.submitSubject} className="p-4 border-b border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input className={inputClass} value={c.subjectName} onChange={(e) => c.setSubjectName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Code</label>
                  <input className={inputClass} value={c.subjectCode} onChange={(e) => c.setSubjectCode(e.target.value)} />
                </div>
                <div className="flex items-end justify-end gap-3">
                  <button type="button" className={btnSecondary} onClick={() => c.setShowSubjectForm(false)}>
                    {t("buttons.cancel")}
                  </button>
                  <button type="submit" disabled={c.isCreatingSubject} className={btnPrimary}>
                    {t("buttons.save")}
                  </button>
                </div>
              </form>
            )}

            {c.isLoadingSubjects ? (
              <Spinner />
            ) : c.subjects.length === 0 ? (
              <NoRecordFound t={t} searchTerm="" clearFilters={() => {}} />
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {c.subjects.map((s) => (
                    <tr key={s.id}>
                      <td className="px-6 py-4 text-sm text-gray-900">{s.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-mono">{s.code}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{s.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {c.activeTab === "teachers" && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-4 flex justify-between items-center border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Teacher Assignments</h2>
              <button className={btnPrimary} onClick={() => c.setShowAssignForm(!c.showAssignForm)}>
                + Assign Teacher
              </button>
            </div>

            {c.showAssignForm && (
              <form onSubmit={c.submitAssign} className="p-4 border-b border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Teacher</label>
                  <select className={inputClass} value={c.assignTeacherId} onChange={(e) => c.setAssignTeacherId(e.target.value)}>
                    <option value="">Select teacher</option>
                    {c.teachers.map((tch) => (
                      <option key={tch.id} value={tch.id}>{tch.name} ({tch.email})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Class</label>
                  <select className={inputClass} value={c.assignClassId} onChange={(e) => c.setAssignClassId(e.target.value)}>
                    <option value="">Select class</option>
                    {c.classes.map((k) => (
                      <option key={k.id} value={k.id}>{k.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Section</label>
                  <select className={inputClass} value={c.assignSectionId} onChange={(e) => c.setAssignSectionId(e.target.value)} disabled={!c.assignClassId}>
                    <option value="">Select section</option>
                    {c.assignSections.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select
                    className={inputClass}
                    value={c.assignRole}
                    onChange={(e) => c.setAssignRole(e.target.value as "SUBJECT_TEACHER" | "CLASS_TEACHER")}
                  >
                    <option value="SUBJECT_TEACHER">Subject Teacher</option>
                    <option value="CLASS_TEACHER">Class Teacher</option>
                  </select>
                </div>
                {c.assignRole === "SUBJECT_TEACHER" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Subject</label>
                    <select className={inputClass} value={c.assignSubjectId} onChange={(e) => c.setAssignSubjectId(e.target.value)}>
                      <option value="">Select subject</option>
                      {c.subjects.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="flex items-end justify-end gap-3">
                  <button type="button" className={btnSecondary} onClick={() => c.setShowAssignForm(false)}>
                    {t("buttons.cancel")}
                  </button>
                  <button type="submit" disabled={c.isAssigning} className={btnPrimary}>
                    {t("buttons.save")}
                  </button>
                </div>
              </form>
            )}

            {c.isLoadingAssignments ? (
              <Spinner />
            ) : c.teacherAssignments.length === 0 ? (
              <NoRecordFound t={t} searchTerm="" clearFilters={() => {}} />
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teacher</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Section</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {c.teacherAssignments.map((a) => (
                    <tr key={a.id}>
                      <td className="px-6 py-4 text-sm text-gray-900">{a.teacherUserId?.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{a.classId?.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{a.sectionId?.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{a.subjectId?.name || "-"}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{a.assignmentRole}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminClasses;
