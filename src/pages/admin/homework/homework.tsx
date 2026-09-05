import LogoSpinner from "../../../components/logo-spinner";
import NoRecordFound from "../../../components/no-record-found";
import { useTranslation } from "react-i18next";
import { useHomeworkController } from "./homework-controller";

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Homework</h1>
        <p className="mt-1 text-sm text-gray-500">Assign and manage homework for a class section</p>
      </div>

      <div className="bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
            <select className={inputClass} value={c.classId} onChange={(e) => c.setClassId(e.target.value)} disabled={!c.academicYearId}>
              <option value="">Select</option>
              {c.classes.map((k) => (
                <option key={k.id} value={k.id}>{k.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Section</label>
            <select className={inputClass} value={c.sectionId} onChange={(e) => c.setSectionId(e.target.value)} disabled={!c.classId}>
              <option value="">Select</option>
              {c.sections.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
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
              <label className="block text-sm font-medium text-gray-700">Subject</label>
              <select className={inputClass} value={c.subjectId} onChange={(e) => c.setSubjectId(e.target.value)}>
                <option value="">Select subject</option>
                {c.subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
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
            <LogoSpinner offsetSidebar />
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
