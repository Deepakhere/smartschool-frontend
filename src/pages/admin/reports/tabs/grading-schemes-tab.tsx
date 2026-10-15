import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { TrashIcon } from "@heroicons/react/24/outline";

import ErrorState from "@/components/error-state";
import { TextField } from "@/components/form-fields";
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow, TableSkeleton } from "@/components/table";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { useError } from "@/hooks";
import { defaultGradingSchemeValues, gradingSchemeSchema, GradingSchemeFormValues } from "../reports.schema";
import { useCreateGradingScheme, useGetGradingSchemes } from "../service/exams-service";

const GradingSchemesTab = ({ organizationId }: { organizationId: string }) => {
  const schemes = useGetGradingSchemes(organizationId);
  const createScheme = useCreateGradingScheme(organizationId);
  useError({ mutation: createScheme });

  const form = useForm<GradingSchemeFormValues>({
    resolver: zodResolver(gradingSchemeSchema),
    defaultValues: defaultGradingSchemeValues(),
  });
  const bands = useFieldArray({ control: form.control, name: "bands" });

  const onSubmit = form.handleSubmit((values) =>
    createScheme.mutate(
      {
        name: values.name,
        passPercent: Number(values.passPercent),
        bands: values.bands.map((band) => ({
          grade: band.grade,
          minPercent: Number(band.minPercent),
          maxPercent: Number(band.maxPercent),
          gradePoint: Number(band.gradePoint),
        })),
      },
      {
        onSuccess: () => {
          toast.success("Grading scheme created.");
          form.reset(defaultGradingSchemeValues());
        },
      }
    )
  );

  const items = schemes.data?.items ?? [];

  return (
    <div className="space-y-6">
      <Card>
        <CardTitle className="mb-4 font-medium">Create Grading Scheme</CardTitle>
        <Form {...form}>
          <form onSubmit={onSubmit} noValidate className="space-y-4">
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

            <Button type="submit" loading={createScheme.isPending}>
              Create scheme
            </Button>
          </form>
        </Form>
      </Card>

      <Card>
        <CardTitle className="mb-4 font-medium">Existing Schemes</CardTitle>
        {schemes.isError ? (
          <ErrorState error={schemes.error} onRetry={() => schemes.refetch()} />
        ) : schemes.isLoading ? (
          <Table>
            <TableHeader>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">Pass %</TableHead>
              <TableHead className="text-center">Bands</TableHead>
            </TableHeader>
            <TableSkeleton columns={3} />
          </Table>
        ) : (
          <Table>
            <TableHeader>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">Pass %</TableHead>
              <TableHead className="text-center">Bands</TableHead>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableEmpty colSpan={3} title="No grading schemes yet" description="Create one above; every exam needs a grading scheme." />
              ) : (
                items.map((scheme) => (
                  <TableRow key={scheme.id}>
                    <TableCell className="font-medium text-gray-900">{scheme.name}</TableCell>
                    <TableCell className="text-center">{scheme.passPercent}%</TableCell>
                    <TableCell className="text-center">{scheme.bands.map((band) => band.grade).join(", ")}</TableCell>
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

export default GradingSchemesTab;
