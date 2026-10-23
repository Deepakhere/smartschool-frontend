import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { useError } from "@/hooks";
import { defaultGradingSchemeValues, gradingSchemeSchema, GradingSchemeFormValues } from "../reports.schema";
import { useCreateGradingScheme, useGetGradingSchemes } from "../service/exams-service";

const useGradingSchemesTabController = (organizationId: string) => {
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

  return {
    form,
    bands,
    onSubmit,
    isCreating: createScheme.isPending,
    schemes: schemes.data?.items ?? [],
    isLoading: schemes.isLoading,
    error: schemes.isError ? schemes.error : null,
    retry: () => schemes.refetch(),
  };
};

export default useGradingSchemesTabController;
