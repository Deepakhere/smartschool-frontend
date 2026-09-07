import Spinner from "../../../components/spinner";
import NoRecordFound from "../../../components/no-record-found";
import SectionHeader from "../../../components/section-header";
import CustomSelectDropdown from "../../../components/custom-select";
import { useTranslation } from "react-i18next";
import { useHomeworkController } from "./homework-controller";
import { SelectOption } from "../../../types";

const inputClass =
  "mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm";
const btnPrimary =
  "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50";
const btnSecondary =
  "inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50";

const Homework = () => {
  const { t } = useTranslation();
  const c = useHomeworkController();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <SectionHeader title="Homework" description="Assign and manage homework for a class section" />

      <div className="bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
            <CustomSelectDropdown
              placeholder="Select"
              options={c.academicYears.map((y): SelectOption => ({ id: y.id, name: y.name }))}
              value={(() => {
                const y = c.academicYears.find((y) => y.id === c.academicYearId);
                return y ? { id: y.id, name: y.name } : null;
              })()}
              onChange={(o) => c.setAcademicYearId(String(o.id))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <CustomSelectDropdown
              placeholder="Select"
              disabled={!c.academicYearId}
              options={c.classes.map((k): SelectOption => ({ id: k.id, name: k.name }))}
              value={(() => {
                const k = c.classes.find((k) => k.id === c.classId);
                return k ? { id: k.id, name: k.name } : null;
              })()}
              onChange={(o) => c.setClassId(String(o.id))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
            <CustomSelectDropdown
              placeholder="Select"
              disabled={!c.classId}
              options={c.sections.map((s): SelectOption => ({ id: s.id, name: s.name }))}
              value={(() => {
                const s = c.sections.find((s) => s.id === c.sectionId);
                return s ? { id: s.id, name: s.name } : null;
              })()}
              onChange={(o) => c.setSectionId(String(o.id))}
            />
          </div>
          <div className="flex items-end">
            <button className={btnPrimary} onClick={() => c.setShowForm(!c.showForm)} disabled={!c.sectionId}>
              + Assign Homework
            </button>
          </div>
        </div>
      </div>

      {c.showForm && (
        <form onSubmit={c.handleSubmit} className="bg-white shadow rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <CustomSelectDropdown
                placeholder="Select subject"
                options={c.subjects.map((s): SelectOption => ({ id: s.id, name: s.name }))}
                value={(() => {
                  const s = c.subjects.find((s) => s.id === c.subjectId);
                  return s ? { id: s.id, name: s.name } : null;
                })()}
                onChange={(o) => c.setSubjectId(String(o.id))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input className={inputClass} value={c.title} onChange={(e) => c.setTitle(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea className={inputClass} rows={3} value={c.description} onChange={(e) => c.setDescription(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Assigned Date</label>
              <input type="date" className={inputClass} value={c.assignedDate} onChange={(e) => c.setAssignedDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Due Date</label>
              <input type="date" className={inputClass} value={c.dueDate} onChange={(e) => c.setDueDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t("labels.attachment")}</label>
              <input type="file" accept=".pdf" onChange={c.handleFileChange} className={inputClass} />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" className={btnSecondary} onClick={() => c.setShowForm(false)}>
              {t("buttons.cancel")}
            </button>
            <button type="submit" disabled={c.isCreating} className={btnPrimary}>
              {t("buttons.save")}
            </button>
          </div>
        </form>
      )}

      {c.sectionId && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Assigned Homework</h2>
          </div>
          {c.isLoadingHomework ? (
            <Spinner />
          ) : c.homeworkList.length === 0 ? (
            <NoRecordFound t={t} searchTerm="" clearFilters={() => {}} />
          ) : (
            <div className="divide-y divide-gray-100">
              {c.homeworkList.map((hw) => (
                <div key={hw.id} className="px-4 py-4 flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {hw.title}{" "}
                      <span className="text-xs font-normal text-gray-500">
                        ({typeof hw.subjectId === "object" ? hw.subjectId.name : ""})
                      </span>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{hw.description}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Due {new Date(hw.dueDate).toLocaleDateString()}
                      {hw.attachmentURL && (
                        <>
                          {" · "}
                          <a href={hw.attachmentURL} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                            {t("labels.attachment")}
                          </a>
                        </>
                      )}
                    </p>
                  </div>
                  <button onClick={() => c.handleDelete(hw.id)} className="text-sm text-red-600 hover:text-red-800">
                    {t("buttons.delete")}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Homework;
