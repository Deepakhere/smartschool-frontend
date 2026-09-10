import Spinner from "@/components/spinner";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import NoRecordFound from "@/components/no-record-found";
import SectionHeader from "@/components/section-header";
import CustomSelectDropdown from "@/components/custom-select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { useHomeworkController } from "./homework-controller";
import { SelectOption } from "@/types";

const btnPrimary =
  "inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50";
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
        <Form {...c.form}>
          <form onSubmit={c.onSubmit} className="bg-white shadow rounded-lg p-4 space-y-4" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={c.form.control}
                name="subjectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <CustomSelectDropdown
                        placeholder="Select subject"
                        options={c.subjects.map((s): SelectOption => ({ id: s.id, name: s.name }))}
                        value={(() => {
                          const s = c.subjects.find((s) => s.id === field.value);
                          return s ? { id: s.id, name: s.name } : null;
                        })()}
                        onChange={(o) => field.onChange(String(o.id))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={c.form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={c.form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                control={c.form.control}
                name="assignedDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={c.form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700">{t("labels.attachment")}</label>
                <Input type="file" accept=".pdf" onChange={c.handleFileChange} />
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
        </Form>
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
                          <a
                            href={hw.attachmentURL}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary-600 hover:underline"
                          >
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

      <DeleteConfirmationDialog
        open={!!c.homeworkIdPendingDelete}
        title="Delete Homework"
        description="Are you sure you want to delete this homework? This action cannot be undone."
        isLoading={c.isDeleting}
        onClose={c.cancelDelete}
        onConfirm={c.confirmDelete}
      />
    </div>
  );
};

export default Homework;
