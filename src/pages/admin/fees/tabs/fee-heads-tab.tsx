import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import ErrorState from "@/components/error-state";
import { CheckboxField, SelectField, TextField } from "@/components/form-fields";
import { Table, TableBody, TableCell, TableEmpty, TableHead, TableHeader, TableRow, TableSkeleton } from "@/components/table";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useError } from "@/hooks";
import { SelectOption } from "@/types";
import { defaultFeeHeadValues, feeHeadSchema, FeeHeadFormValues } from "../fees.schema";
import { useCreateFeeHead, useGetFeeHeads } from "../service/fees-service";

const categoryOptions: SelectOption[] = [
  { id: "tuition", name: "Tuition" },
  { id: "transport", name: "Transport" },
  { id: "hostel", name: "Hostel" },
  { id: "exam", name: "Exam" },
  { id: "misc", name: "Misc" },
];

const FeeHeadsTab = ({ organizationId }: { organizationId: string }) => {
  const feeHeads = useGetFeeHeads(organizationId);
  const createFeeHead = useCreateFeeHead(organizationId);
  useError({ mutation: createFeeHead });

  const form = useForm<FeeHeadFormValues>({ resolver: zodResolver(feeHeadSchema), defaultValues: defaultFeeHeadValues });

  const onSubmit = form.handleSubmit((values) =>
    createFeeHead.mutate(values, {
      onSuccess: () => {
        toast.success("Fee head created.");
        form.reset(defaultFeeHeadValues);
      },
    })
  );

  const items = feeHeads.data?.items ?? [];

  return (
    <Card>
      <CardTitle className="mb-4 font-medium">Create Fee Head</CardTitle>
      <Form {...form}>
        <form onSubmit={onSubmit} noValidate className="grid grid-cols-1 items-start gap-3 sm:grid-cols-4">
          <TextField form={form} name="name" label="Name" placeholder="Tuition fee" />
          <TextField form={form} name="code" label="Code" placeholder="TUI" />
          <SelectField form={form} name="category" label="Category" options={categoryOptions} />
          <div className="flex items-center justify-between gap-3 sm:mt-6">
            <CheckboxField form={form} name="isRefundable" label="Refundable" />
            <Button type="submit" loading={createFeeHead.isPending}>
              Add
            </Button>
          </div>
        </form>
      </Form>

      <div className="mt-6">
        {feeHeads.isError ? (
          <ErrorState error={feeHeads.error} onRetry={() => feeHeads.refetch()} />
        ) : feeHeads.isLoading ? (
          <Table>
            <TableHeader>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">Code</TableHead>
              <TableHead className="text-center">Category</TableHead>
              <TableHead className="text-center">Refundable</TableHead>
            </TableHeader>
            <TableSkeleton columns={4} />
          </Table>
        ) : (
          <Table>
            <TableHeader>
              <TableHead>Name</TableHead>
              <TableHead className="text-center">Code</TableHead>
              <TableHead className="text-center">Category</TableHead>
              <TableHead className="text-center">Refundable</TableHead>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableEmpty colSpan={4} message="No fee heads yet. Add one above." />
              ) : (
                items.map((head) => (
                  <TableRow key={head.id}>
                    <TableCell className="font-medium text-gray-900">{head.name}</TableCell>
                    <TableCell className="text-center">{head.code}</TableCell>
                    <TableCell className="text-center capitalize">{head.category}</TableCell>
                    <TableCell className="text-center">{head.isRefundable ? "Yes" : "No"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </Card>
  );
};

export default FeeHeadsTab;
