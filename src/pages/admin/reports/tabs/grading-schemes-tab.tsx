import { TrashIcon } from "@heroicons/react/24/outline";

import DataTable, { DataTableColumn } from "@/components/data-table";
import ErrorState from "@/components/error-state";
import { TextField } from "@/components/form-fields";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { IGradingScheme } from "@/types";
import useGradingSchemesTabController from "./grading-schemes-tab-controller";

const columns: DataTableColumn<IGradingScheme>[] = [
  { id: "name", header: "Name", cell: ({ row }) => <span className="font-medium text-gray-900">{row.original.name}</span> },
  { id: "passPercent", header: "Pass %", meta: { align: "center" }, cell: ({ row }) => `${row.original.passPercent}%` },
  {
    id: "bands",
    header: "Bands",
    meta: { align: "center" },
    cell: ({ row }) => row.original.bands.map((band) => band.grade).join(", "),
  },
];

const GradingSchemesTab = ({ organizationId }: { organizationId: string }) => {
  const c = useGradingSchemesTabController(organizationId);
  const { form, bands } = c;

  return (
    <div className="space-y-6">
      <Card>
        <CardTitle className="mb-4 font-medium">Create Grading Scheme</CardTitle>
        <Form {...form}>
          <form onSubmit={c.onSubmit} noValidate className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextField form={form} name="name" label="Name" />
              <TextField form={form} name="passPercent" label="Pass Percent" type="number" min={0} max={100} />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <Label className="mb-0">Grade Bands</Label>
                <Button variant="link" onClick={() => bands.append({ grade: "", minPercent: "", maxPercent: "", gradePoint: "" })}>
                  + Add band
                </Button>
              </div>
              <div className="space-y-2">
                {bands.fields.map((row, index) => (
                  <div key={row.id} className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] items-start gap-2">
                    <TextField form={form} name={`bands.${index}.grade`} label="Grade" placeholder="A+" />
                    <TextField form={form} name={`bands.${index}.minPercent`} label="Min %" type="number" />
                    <TextField form={form} name={`bands.${index}.maxPercent`} label="Max %" type="number" />
                    <TextField form={form} name={`bands.${index}.gradePoint`} label="Grade point" type="number" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="mt-6"
                      aria-label="Remove band"
                      disabled={bands.fields.length === 1}
                      onClick={() => bands.remove(index)}
                    >
                      <TrashIcon className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" loading={c.isCreating}>
              Create scheme
            </Button>
          </form>
        </Form>
      </Card>

      <div>
        <h3 className="mb-3 text-lg font-medium text-gray-900">Existing Schemes</h3>
        {c.error ? (
          <ErrorState error={c.error} onRetry={c.retry} />
        ) : (
          <DataTable
            columns={columns}
            data={c.schemes}
            getRowId={(scheme) => scheme.id}
            isLoading={c.isLoading}
            itemLabel={{ one: "scheme", other: "schemes" }}
            pagination={{ pageSize: 20 }}
            empty={{ title: "No grading schemes yet", description: "Create one above; every exam needs a grading scheme." }}
          />
        )}
      </div>
    </div>
  );
};

export default GradingSchemesTab;
