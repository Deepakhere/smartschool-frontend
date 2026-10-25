import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { useError } from "@/hooks";
import { ILetterhead } from "@/types";
import { letterheadDefaults, letterheadSchema, LetterheadFormValues } from "../school.schema";
import { useUpdateLetterhead } from "../service/letterhead-service";

const useLetterheadFormController = (organizationId: string, letterhead?: Partial<ILetterhead>) => {
  const form = useForm<LetterheadFormValues>({
    resolver: zodResolver(letterheadSchema),
    defaultValues: letterheadDefaults(letterhead),
  });
  const save = useUpdateLetterhead(organizationId);
  useError({ mutation: save });

  // refreshed school data replaces the form, unless the user is mid-edit
  useEffect(() => {
    if (!form.formState.isDirty) form.reset(letterheadDefaults(letterhead));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [letterhead]);

  const onSubmit = form.handleSubmit((values) =>
    save.mutate(values, {
      onSuccess: (saved) => {
        form.reset(letterheadDefaults(saved));
        toast.success("School details saved. New certificates will print them.");
      },
    })
  );

  return { form, onSubmit, isSaving: save.isPending, isDirty: form.formState.isDirty };
};

export default useLetterheadFormController;
