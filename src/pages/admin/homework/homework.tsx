import { PlusIcon } from "@heroicons/react/20/solid";

import Spinner from "@/components/spinner";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import EmptyState from "@/components/empty-state";
import SectionHeader from "@/components/section-header";
import CustomSelectDropdown from "@/components/custom-select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";
import { useHomeworkController } from "./homework-controller";
import { SelectOption } from "@/types";

const Homework = () => {
  const { t } = useTranslation();
  const c = useHomeworkController();
  const yearOptions = c.academicYears.map((y): SelectOption => ({ id: y.id, name: y.name }));
  const classOptions = c.classes.map((k): SelectOption => ({ id: k.id, name: k.name }));
  const sectionOptions = c.sections.map((s): SelectOption => ({ id: s.id, name: s.name }));
  const subjectOptions = c.subjects.map((s): SelectOption => ({ id: s.id, name: s.name }));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <SectionHeader
        title="Homework"
        description="Assign and manage homework for a class section"
        action={{
          label: "Assign Homework",
          icon: PlusIcon,
          onClick: c.toggleForm,
          disabled: !c.sectionId,
          title: !c.sectionId ? "Pick a class and section first" : undefined,
        }}
      />

      {c.hasNoClasses && (
        <p className="rounded-lg bg-white p-4 text-sm text-gray-600 shadow">
          You are not assigned to any class yet. Ask your school admin to assign you to a section.
        </p>
      )}

      <div className="bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label>Academic Year</Label>
            <CustomSelectDropdown
              placeholder="Select"
              options={yearOptions}
              value={yearOptions.find((option) => option.id === c.academicYearId) ?? null}
              onChange={(o) => c.setAcademicYearId(String(o.id))}
            />
          </div>
          <div>
            <Label>Class</Label>
            <CustomSelectDropdown
              placeholder="Select"
              disabled={!c.academicYearId}
              options={classOptions}
              value={classOptions.find((option) => option.id === c.classId) ?? null}
              onChange={(o) => c.setClassId(String(o.id))}
            />
          </div>
          <div>
            <Label>Section</Label>
            <CustomSelectDropdown
              placeholder="Select"
              disabled={!c.classId}
              options={sectionOptions}
              value={sectionOptions.find((option) => option.id === c.sectionId) ?? null}
              onChange={(o) => c.setSectionId(String(o.id))}
            />
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
                        options={subjectOptions}
                        value={subjectOptions.find((option) => option.id === field.value) ?? null}
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
                <Label>{t("labels.attachment")}</Label>
                <Input type="file" accept=".pdf" onChange={c.handleFileChange} />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => c.setShowForm(false)}>
                {t("buttons.cancel")}
              </Button>
              <Button type="submit" disabled={c.isCreating}>
                {t("buttons.save")}
              </Button>
            </div>
          </form>
        </Form>
      )}

      {!c.sectionId && !c.hasNoClasses && (
        <div className="bg-white shadow rounded-lg">
          <EmptyState
            title={c.classes.length ? "Pick a class and section" : "No classes yet"}
            description={
              c.classes.length
                ? "Choose a class and section above to see and assign its homework."
                : "Add an academic year, classes and sections on the Classes page first."
            }
          />
        </div>
      )}

      {c.sectionId && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Assigned Homework</h2>
          </div>
          {c.isLoadingHomework ? (
            <Spinner />
          ) : c.homeworkList.length === 0 ? (
            <EmptyState title="No homework yet" description="Homework set for this section will show up here." />
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
                  <Button
                    variant="link"
                    className="text-red-600 hover:text-red-800"
                    onClick={() => c.handleDelete(hw.id)}
                  >
                    {t("buttons.delete")}
                  </Button>
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
