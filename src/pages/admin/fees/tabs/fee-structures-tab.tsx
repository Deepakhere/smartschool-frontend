import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { TrashIcon } from "@heroicons/react/24/outline";

import ErrorState from "@/components/error-state";
import { ChipsField, DateField, SelectField, TextField } from "@/components/form-fields";
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow, TableSkeleton } from "@/components/table";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { useError } from "@/hooks";
import { SelectOption } from "@/types";
import { formatMoney, toPaise } from "@/utils";
import { useGetAcademicYears, useGetClasses, useGetYearSections } from "../../classes/service/academics-service";
import { defaultFeeStructureValues, feeStructureSchema, FeeStructureFormValues } from "../fees.schema";
import {
  useAssignFeeStructure,
  useCreateFeeStructure,
  useGetFeeHeads,
  useGetFeeStructures,
} from "../service/fees-service";

const sumPaise = (rows: { amount: string }[] = []) => rows.reduce((sum, row) => sum + (toPaise(row.amount || 0) || 0), 0);

const FeeStructuresTab = ({ organizationId }: { organizationId: string }) => {
  const years = useGetAcademicYears(organizationId);
  const currentYearId = years.data?.items.find((year) => year.isCurrent)?.id;
  const classes = useGetClasses(organizationId, currentYearId, "active");
  const sections = useGetYearSections(organizationId, currentYearId);
  const feeHeads = useGetFeeHeads(organizationId);
  const structures = useGetFeeStructures(organizationId);
  const createStructure = useCreateFeeStructure(organizationId);
  const assignStructure = useAssignFeeStructure(organizationId);
  useError({ mutation: createStructure });
  useError({ mutation: assignStructure });

  const form = useForm<FeeStructureFormValues>({
    resolver: zodResolver(feeStructureSchema),
    defaultValues: defaultFeeStructureValues(),
  });
  const items = useFieldArray({ control: form.control, name: "items" });
  const installments = useFieldArray({ control: form.control, name: "installments" });
  const [classIds, itemRows, installmentRows] = useWatch({
    control: form.control,
    name: ["classIds", "items", "installments"],
  });

  const classOptions: SelectOption[] = (classes.data?.items ?? []).map((klass) => ({ id: klass.id, name: klass.name }));
  // only sections of the ticked classes, named with their class since several classes have an "A"
  const sectionOptions: SelectOption[] = (sections.data?.items ?? [])
    .filter((section) => classIds.includes(section.classId))
    .map((section) => ({
      id: section.id,
      name: `${classOptions.find((klass) => klass.id === section.classId)?.name ?? ""} - ${section.name}`,
    }));
  const feeHeadOptions: SelectOption[] = (feeHeads.data?.items ?? []).map((head) => ({ id: head.id, name: head.name }));

  // unticking a class also drops any of its sections that were picked
  const onClassesChange = (nextClassIds: string[]) => {
    const allowed = new Set(
      (sections.data?.items ?? []).filter((section) => nextClassIds.includes(section.classId)).map((section) => section.id)
    );
    form.setValue(
      "sectionIds",
      form.getValues("sectionIds").filter((id) => allowed.has(id))
    );
  };

  const itemsTotal = sumPaise(itemRows);
  const installmentsTotal = sumPaise(installmentRows);
  const installmentsError = form.formState.errors.installments?.root?.message;

  const onSubmit = form.handleSubmit((values) => {
    if (!currentYearId) {
      toast.error("Set a current academic year first (Academics page).");
      return;
    }
    createStructure.mutate(
      {
        academicYearId: currentYearId,
        name: values.name,
        classIds: values.classIds,
        sectionIds: values.sectionIds,
        items: values.items.map((item) => ({ feeHeadId: item.feeHeadId, amount: toPaise(item.amount) })),
        installments: values.installments.map((row) => ({ label: row.label, dueDate: row.dueDate, amount: toPaise(row.amount) })),
      },
      {
        onSuccess: () => {
          toast.success("Fee structure created.");
          form.reset(defaultFeeStructureValues());
        },
      }
    );
  });

  const onAssign = (feeStructureId: string) =>
    assignStructure.mutate(feeStructureId, {
      onSuccess: (data) =>
        toast.success(`Assigned to ${data.assigned_count} student(s), skipped ${data.skipped_count} already assigned.`),
    });

  return (
    <div className="space-y-6">
      <Card>
        <CardTitle className="mb-4 font-medium">Create Fee Structure</CardTitle>
        <Form {...form}>
          <form onSubmit={onSubmit} noValidate className="space-y-5">
            <TextField form={form} name="name" label="Structure name" placeholder="Class 9 Annual Fee" />
            <ChipsField
              form={form}
              name="classIds"
              label="Classes"
              options={classOptions}
              emptyText="No active classes in the current year yet."
              onToggle={onClassesChange}
            />
            <ChipsField
              form={form}
              name="sectionIds"
              label="Sections (optional, narrows the classes above)"
              options={sectionOptions}
              emptyText={classIds.length ? "These classes have no sections yet." : "Pick a class above to see its sections."}
            />

            <div>
              <div className="mb-2 flex items-center justify-between">
                <Label className="mb-0">Fee head items</Label>
                <Button variant="link" onClick={() => items.append({ feeHeadId: "", amount: "" })}>
                  + Add item
                </Button>
              </div>
              {feeHeadOptions.length === 0 && !feeHeads.isLoading && (
                <p className="mb-2 text-sm text-gray-500">Create a fee head first (Fee Heads tab), then pick it here.</p>
              )}
              <div className="space-y-2">
                {items.fields.map((row, index) => (
                  <div key={row.id} className="grid grid-cols-[1fr_1fr_auto] items-start gap-2">
                    <SelectField form={form} name={`items.${index}.feeHeadId`} label="Fee head" options={feeHeadOptions} />
                    <TextField form={form} name={`items.${index}.amount`} label="Amount (₹)" type="number" min={0} step="0.01" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mt-6"
                      aria-label="Remove item"
                      disabled={items.fields.length === 1}
                      onClick={() => items.remove(index)}
                    >
                      <TrashIcon className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                ))}
              </div>
              <p className="mt-1 text-xs text-gray-500">Total: {formatMoney(itemsTotal)}</p>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <Label className="mb-0">Installments</Label>
                <Button
                  variant="link"
                  onClick={() =>
                    installments.append({ label: `Installment ${installments.fields.length + 1}`, dueDate: "", amount: "" })
                  }
                >
                  + Add installment
                </Button>
              </div>
              <div className="space-y-2">
                {installments.fields.map((row, index) => (
                  <div key={row.id} className="grid grid-cols-1 items-start gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
                    <TextField form={form} name={`installments.${index}.label`} label="Label" />
                    <DateField form={form} name={`installments.${index}.dueDate`} label="Due date" />
                    <TextField
                      form={form}
                      name={`installments.${index}.amount`}
                      label="Amount (₹)"
                      type="number"
                      min={0}
                      step="0.01"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="sm:mt-6"
                      aria-label="Remove installment"
                      disabled={installments.fields.length === 1}
                      onClick={() => installments.remove(index)}
                    >
                      <TrashIcon className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                ))}
              </div>
              <p className={`mt-1 text-xs ${itemsTotal === installmentsTotal ? "text-gray-500" : "text-red-600"}`}>
                Total: {formatMoney(installmentsTotal)}
                {itemsTotal !== installmentsTotal && " (must match the items total)"}
              </p>
              {installmentsError && <p className="mt-1 text-sm text-red-600">{installmentsError}</p>}
            </div>

            <Button type="submit" loading={createStructure.isPending}>
              Create structure
            </Button>
          </form>
        </Form>
      </Card>

      <Card>
        <CardTitle className="mb-4 font-medium">Existing structures</CardTitle>
        {structures.isError ? (
          <ErrorState error={structures.error} onRetry={() => structures.refetch()} />
        ) : structures.isLoading ? (
          <Table>
            <TableHeader>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">Classes</TableHead>
              <TableHead className="text-center">Total</TableHead>
              <TableHead className="text-center">Installments</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableHeader>
            <TableSkeleton columns={5} />
          </Table>
        ) : (
          <Table>
            <TableHeader>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">Classes</TableHead>
              <TableHead className="text-center">Total</TableHead>
              <TableHead className="text-center">Installments</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableHeader>
            <TableBody>
              {(structures.data?.items ?? []).length === 0 ? (
                <TableEmpty colSpan={5} title="No fee structures yet" description="Create one above, then assign it to a class to bill its students." />
              ) : (
                structures.data?.items.map((structure) => (
                  <TableRow key={structure.id}>
                    <TableCell className="font-medium text-gray-900">{structure.name}</TableCell>
                    <TableCell className="text-center">{structure.classIds.map((klass) => klass.name).join(", ")}</TableCell>
                    <TableCell className="text-center">
                      {formatMoney(structure.items.reduce((sum, item) => sum + item.amount, 0))}
                    </TableCell>
                    <TableCell className="text-center">{structure.installments.length}</TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="link"
                        loading={assignStructure.isPending && assignStructure.variables === structure.id}
                        disabled={assignStructure.isPending}
                        onClick={() => onAssign(structure.id)}
                      >
                        Assign to students
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
};

export default FeeStructuresTab;
